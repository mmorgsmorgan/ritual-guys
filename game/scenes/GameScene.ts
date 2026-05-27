import Phaser from 'phaser';
import { Ball } from '@game/entities/Ball';
import { Cup } from '@game/entities/Cup';
import { SpawnSystem } from '@game/systems/SpawnSystem';
import { MergeSystem } from '@game/systems/MergeSystem';
import { ChainReactionSystem } from '@game/systems/ChainReactionSystem';
import { ParticleSystem } from '@game/systems/ParticleSystem';
import { ScoreSystem } from '@game/systems/ScoreSystem';
import { AudioManager } from '@game/audio/AudioManager';
import { PHYSICS_CONFIG, GAME_WIDTH, GAME_HEIGHT } from '@game/config/physics';
import { hexToNumber } from '@game/config/evolution';
import { GlowEffect } from '@game/effects/GlowEffect';
import { AuraEffect } from '@game/effects/AuraEffect';
import { EventBus } from '@game/EventBus';

export class GameScene extends Phaser.Scene {
  cup!: Cup;
  spawnSystem!: SpawnSystem;
  mergeSystem!: MergeSystem;
  chainSystem!: ChainReactionSystem;
  particleSystem!: ParticleSystem;
  scoreSystem!: ScoreSystem;
  audioManager!: AudioManager;

  balls = new Set<Ball>();
  isGameOver = false;
  overflowTimer = 0;
  startTime = 0;

  dropLine!: Phaser.GameObjects.Graphics;
  overflowLine!: Phaser.GameObjects.Graphics;
  effectsGraphics!: Phaser.GameObjects.Graphics;

  private onMergeHandler!: (data: { tier: any; x: number; y: number; fromTier: number }) => void;
  private onRestartHandler!: () => void;

  private _restarting = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.isGameOver = false;
    this._restarting = false;
    this.overflowTimer = 0;
    this.startTime = this.time.now;
    this.balls.clear();

    this.cameras.main.setZoom(1);
    this.cameras.main.setScroll(0, 0);
    this.cameras.main.setAlpha(1);

    this.cup = new Cup(this);
    this.spawnSystem = new SpawnSystem(this);
    this.mergeSystem = new MergeSystem(this, this.balls);
    this.chainSystem = new ChainReactionSystem();
    this.particleSystem = new ParticleSystem(this);
    this.scoreSystem = new ScoreSystem();
    this.audioManager = new AudioManager(this);

    this.drawOverflowLine();
    this.drawDropLine();
    this.effectsGraphics = this.add.graphics().setDepth(9);

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isGameOver) return;
      this.spawnSystem.updateDropPosition(pointer.x);
      this.updateDropLine(pointer.x);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isGameOver) return;
      this.audioManager.init();
      this.spawnSystem.updateDropPosition(pointer.x);
      const ball = this.spawnSystem.drop();
      if (ball) {
        this.balls.add(ball);
        this.scoreSystem.onBallDropped();
        this.audioManager.playDrop(ball.tier.radius);
      }
    });

    this.onMergeHandler = (data) => {
      this.chainSystem.onMerge(this.time.now);
      const points = this.scoreSystem.addMergeScore(data.tier.id, this.chainSystem.multiplier);
      this.particleSystem.emitMerge(data.x, data.y, data.tier, this.chainSystem.chainCount);
      this.particleSystem.emitScorePopup(data.x, data.y - 20, points, this.chainSystem.multiplier);
      this.audioManager.playMerge(data.tier.id);

      if (this.chainSystem.chainCount > 1) {
        this.audioManager.playChain(this.chainSystem.chainCount);
      }
    };

    this.onRestartHandler = () => {
      if (this._restarting) return;
      this._restarting = true;
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.cameras.main.stopFollow();
      this.cameras.main.setZoom(1);
      this.cameras.main.setScroll(0, 0);
      this.cameras.main.setAlpha(1);
      this.scene.restart();
    };

    EventBus.on('merge', this.onMergeHandler);
    EventBus.on('restart-game', this.onRestartHandler);
    this.events.on('shutdown', this.shutdown, this);

    EventBus.emit('game-started');
  }

  private drawOverflowLine() {
    this.overflowLine = this.add.graphics();
    this.overflowLine.setDepth(50);
    const y = PHYSICS_CONFIG.overflow.y;
    const { leftX, rightX } = PHYSICS_CONFIG.cup;
    const dashLen = 6;
    const gapLen = 8;
    this.overflowLine.lineStyle(1, 0xcc4466, 0.4);
    for (let px = leftX; px < rightX; px += dashLen + gapLen) {
      this.overflowLine.lineBetween(px, y, Math.min(px + dashLen, rightX), y);
    }
  }

  private drawDropLine() {
    this.dropLine = this.add.graphics();
    this.dropLine.setDepth(49);
  }

  private updateDropLine(x: number) {
    const g = this.dropLine;
    g.clear();
    const color = this.spawnSystem?.nextTier
      ? hexToNumber(this.spawnSystem.nextTier.colors[0])
      : 0xffffff;
    const startY = PHYSICS_CONFIG.spawn.y + 20;
    const endY = PHYSICS_CONFIG.cup.floorY;
    const dashLen = 6;
    const gapLen = 8;
    g.lineStyle(1, color, 0.2);
    for (let y = startY; y < endY; y += dashLen + gapLen) {
      g.lineBetween(x, y, x, Math.min(y + dashLen, endY));
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    try {
      const maxV = PHYSICS_CONFIG.maxVelocity;
      const deadZone = GAME_HEIGHT + 200;
      for (const ball of this.balls) {
        if (ball.isMarkedForRemoval) continue;
        const vel = ball.body.velocity;
        if (vel && (Math.abs(vel.x) > maxV || Math.abs(vel.y) > maxV)) {
          this.matter.body.setVelocity(ball.body, {
            x: Phaser.Math.Clamp(vel.x, -maxV, maxV),
            y: Phaser.Math.Clamp(vel.y, -maxV, maxV),
          });
        }
        if (ball.body.position.y > deadZone) {
          ball.destroy();
          this.balls.delete(ball);
        }
      }

      for (const ball of this.balls) {
        ball.update(time, delta);
      }

      this.effectsGraphics.clear();
      for (const ball of this.balls) {
        if (ball.isMarkedForRemoval || ball.isPreview) continue;
        GlowEffect.render(this.effectsGraphics, ball.body.position.x, ball.body.position.y, ball.tier, time);
        AuraEffect.render(this.effectsGraphics, ball.body.position.x, ball.body.position.y, ball.tier, time);
      }

      this.mergeSystem.checkCollisions();
      this.mergeSystem.processMerges();
      this.chainSystem.update(time);
      this.checkOverflow(time, delta);
    } catch (e: any) {
      console.error('[GameScene] update crash:', e);
    }
  }

  private checkOverflow(time: number, _delta: number) {
    const overflowY = PHYSICS_CONFIG.overflow.y;

    for (const ball of this.balls) {
      if (ball.isMarkedForRemoval) continue;
      const settled = Math.abs(ball.body.velocity.y) < 1;
      if (ball.body.position.y < overflowY && settled) {
        const age = time - ball.createdAt;
        if (age > 500) {
          this.triggerGameOver();
          return;
        }
      }
    }
  }

  private triggerGameOver() {
    this.isGameOver = true;
    this.audioManager.playGameOver();

    for (const ball of this.balls) {
      if (!ball.isMarkedForRemoval) {
        this.matter.body.setStatic(ball.body, true);
      }
    }

    let highestBall: Ball | null = null;
    for (const ball of this.balls) {
      if (!ball.isMarkedForRemoval) {
        if (!highestBall || ball.tier.id > highestBall.tier.id) {
          highestBall = ball;
        }
      }
    }

    if (highestBall) {
      this.cameras.main.pan(
        highestBall.body.position.x,
        highestBall.body.position.y,
        1000,
        'Power2',
      );
      this.cameras.main.zoomTo(1.5, 1000, 'Power2');
    }

    const stats = {
      ...this.scoreSystem.getStats(),
      durationSeconds: Math.floor((this.time.now - this.startTime) / 1000),
    };

    this.time.delayedCall(1500, () => {
      EventBus.emit('game-over', stats);
    });
  }

  shutdown() {
    EventBus.off('merge', this.onMergeHandler);
    EventBus.off('restart-game', this.onRestartHandler);
    this.events.off('shutdown', this.shutdown, this);
    this.tweens.killAll();
    this.spawnSystem?.destroy();
    this.audioManager?.destroy();
    this.effectsGraphics?.destroy();
    for (const ball of this.balls) {
      ball.destroy();
    }
    this.balls.clear();
    this.matter?.world?.remove(this.matter.world.getAllBodies());
  }
}
