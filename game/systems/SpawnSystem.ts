import Phaser from 'phaser';
import { Ball } from '@game/entities/Ball';
import { getRandomSpawnTier, type EvolutionTier } from '@game/config/evolution';
import { PHYSICS_CONFIG, GAME_WIDTH } from '@game/config/physics';
import { EventBus } from '@game/EventBus';

export class SpawnSystem {
  scene: Phaser.Scene;
  nextTier: EvolutionTier;
  previewBall: Ball | null = null;
  lastDropTime = 0;
  canDrop = true;
  dropX: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.nextTier = getRandomSpawnTier();
    this.dropX = GAME_WIDTH / 2;
    this.createPreview();
  }

  private createPreview() {
    this.previewBall?.destroy();
    this.previewBall = new Ball(
      this.scene,
      this.dropX,
      PHYSICS_CONFIG.spawn.y,
      this.nextTier,
      true,
    );
    this.scene.tweens.add({
      targets: this.previewBall.container,
      y: PHYSICS_CONFIG.spawn.y - 3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    EventBus.emit('next-ball-changed', this.nextTier);
  }

  updateDropPosition(x: number) {
    const { leftX, rightX } = PHYSICS_CONFIG.cup;
    const r = this.nextTier.radius;
    this.dropX = Phaser.Math.Clamp(x, leftX + r + 5, rightX - r - 5);
    if (this.previewBall && !this.previewBall.isMarkedForRemoval) {
      this.scene.matter.body.setPosition(this.previewBall.body, {
        x: this.dropX,
        y: PHYSICS_CONFIG.spawn.y,
      });
      this.previewBall.container.setPosition(this.dropX, PHYSICS_CONFIG.spawn.y);
    }
  }

  drop(): Ball | null {
    const now = this.scene.time.now;
    if (!this.canDrop || now - this.lastDropTime < PHYSICS_CONFIG.spawn.cooldownMs) {
      return null;
    }

    this.lastDropTime = now;
    this.canDrop = false;

    const dropTier = this.nextTier;
    const dropX = this.dropX;
    const dropY = PHYSICS_CONFIG.spawn.y;

    // Destroy the static preview
    this.previewBall?.destroy();
    this.previewBall = null;

    // Create a fresh dynamic ball at the same position
    const ball = new Ball(this.scene, dropX, dropY, dropTier, false);

    EventBus.emit('ball-dropped', dropTier);

    this.scene.time.delayedCall(PHYSICS_CONFIG.spawn.cooldownMs, () => {
      this.nextTier = getRandomSpawnTier();
      this.canDrop = true;
      this.createPreview();
    });

    return ball;
  }

  destroy() {
    this.previewBall?.destroy();
  }
}
