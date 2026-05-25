import Phaser from 'phaser';
import { type EvolutionTier, hexToNumber } from '@game/config/evolution';

export class ParticleSystem {
  scene: Phaser.Scene;
  emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  emitMerge(x: number, y: number, tier: EvolutionTier, chainCount: number) {
    const color = hexToNumber(tier.colors[0]);
    const count = 12 + tier.id * 2 + chainCount * 3;

    try {
      const particles = this.scene.add.particles(x, y, '__WHITE', {
        speed: { min: 80, max: 200 + tier.id * 30 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.8 + tier.id * 0.1, end: 0 },
        lifespan: { min: 300, max: 600 + tier.id * 50 },
        quantity: count,
        emitting: false,
        tint: [color],
        gravityY: 100,
      });

      particles.explode(count);

      this.scene.time.delayedCall(1200, () => {
        particles.destroy();
      });

      if (chainCount > 1) {
        this.emitChainRing(x, y, tier, chainCount);
      }

      if (tier.id >= 5) {
        this.scene.cameras.main.shake(
          100 + tier.id * 20,
          0.003 * tier.id,
        );
      }
    } catch (e) {
      console.warn('Particle emit failed:', e);
    }
  }

  private emitChainRing(x: number, y: number, tier: EvolutionTier, chainCount: number) {
    const color = hexToNumber(tier.colors[0]);
    try {
      const ringParticles = this.scene.add.particles(x, y, '__WHITE', {
        speed: { min: 100, max: 150 + chainCount * 30 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        lifespan: 400,
        quantity: 8,
        emitting: false,
        tint: [color, 0xffffff],
      });

      ringParticles.explode(8);

      this.scene.time.delayedCall(800, () => {
        ringParticles.destroy();
      });
    } catch (e) {
      console.warn('Chain ring particle failed:', e);
    }
  }

  emitScorePopup(x: number, y: number, score: number, chain: number) {
    const color = chain > 1 ? '#FFD700' : '#FFFFFF';
    const size = chain > 1 ? 18 + chain * 2 : 16;
    const text = chain > 1 ? `+${score} x${chain}` : `+${score}`;

    const popup = this.scene.add.text(x, y, text, {
      fontSize: `${size}px`,
      fontFamily: "'Fredoka One', Impact, sans-serif",
      color,
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: popup,
      y: y - 60,
      alpha: 0,
      scale: 1.3,
      duration: 800,
      ease: 'Power2',
      onComplete: () => popup.destroy(),
    });
  }
}
