import { Ball } from '@game/entities/Ball';
import { getTier, EVOLUTION_TIERS } from '@game/config/evolution';
import { EventBus } from '@game/EventBus';

interface MergeEntry {
  ballA: Ball;
  ballB: Ball;
  tierId: number;
  midX: number;
  midY: number;
}

export class MergeSystem {
  scene: Phaser.Scene;
  mergeQueue: MergeEntry[] = [];
  balls: Set<Ball>;

  constructor(scene: Phaser.Scene, balls: Set<Ball>) {
    this.scene = scene;
    this.balls = balls;
    // Collision detection done manually in checkCollisions() called from update
  }

  checkCollisions() {
    const ballArray = Array.from(this.balls);
    for (let i = 0; i < ballArray.length; i++) {
      for (let j = i + 1; j < ballArray.length; j++) {
        const a = ballArray[i];
        const b = ballArray[j];
        if (a.isMarkedForRemoval || b.isMarkedForRemoval) continue;
        if (a.isPreview || b.isPreview) continue;
        if (a.tier.id !== b.tier.id) continue;
        if (a.tier.id >= EVOLUTION_TIERS.length) continue;

        const dx = a.body.position.x - b.body.position.x;
        const dy = a.body.position.y - b.body.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const touching = dist < (a.tier.radius + b.tier.radius) * 1.05;

        if (!touching) continue;

        const alreadyQueued = this.mergeQueue.some(
          (e) =>
            e.ballA === a || e.ballA === b ||
            e.ballB === a || e.ballB === b,
        );
        if (alreadyQueued) continue;

        a.isMarkedForRemoval = true;
        b.isMarkedForRemoval = true;

        this.mergeQueue.push({
          ballA: a,
          ballB: b,
          tierId: a.tier.id,
          midX: (a.body.position.x + b.body.position.x) / 2,
          midY: (a.body.position.y + b.body.position.y) / 2,
        });
      }
    }
  }

  processMerges(): Ball[] {
    if (this.mergeQueue.length === 0) return [];

    const newBalls: Ball[] = [];

    for (const entry of this.mergeQueue) {
      this.balls.delete(entry.ballA);
      this.balls.delete(entry.ballB);
      entry.ballA.destroy();
      entry.ballB.destroy();

      const nextTier = getTier(entry.tierId + 1);
      if (!nextTier) {
        EventBus.emit('merge', {
          tier: {
            id: entry.tierId + 1,
            colors: entry.ballA.tier.colors,
            radius: entry.ballA.tier.radius,
          },
          x: entry.midX,
          y: entry.midY,
          fromTier: entry.tierId,
        });
        continue;
      }

      const newBall = new Ball(this.scene, entry.midX, entry.midY, nextTier);
      this.balls.add(newBall);
      newBalls.push(newBall);

      this.scene.tweens.add({
        targets: newBall.container,
        scaleX: { from: 0.3, to: 1 },
        scaleY: { from: 0.3, to: 1 },
        duration: 200,
        ease: 'Back.easeOut',
      });

      EventBus.emit('merge', {
        tier: nextTier,
        x: entry.midX,
        y: entry.midY,
        fromTier: entry.tierId,
      });
    }

    this.mergeQueue = [];
    return newBalls;
  }
}
