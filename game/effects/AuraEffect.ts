import Phaser from 'phaser';
import { type EvolutionTier, hexToNumber } from '@game/config/evolution';

export class AuraEffect {
  static render(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    tier: EvolutionTier,
    time: number,
  ) {
    if (tier.id < 4) return;

    const color = hexToNumber(tier.colors[0]);
    const ringCount = tier.id >= 7 ? 3 : tier.id >= 5 ? 2 : 1;

    for (let i = 0; i < ringCount; i++) {
      const phase = time * 0.002 + i * 2.1;
      const radius = tier.radius + 8 + i * 8 + Math.sin(phase) * 3;
      const alpha = (0.20 - i * 0.05) * (0.6 + Math.sin(phase) * 0.4);

      graphics.lineStyle(1.5, color, Math.max(alpha, 0.01));
      graphics.strokeCircle(x, y, radius);
    }

    if (tier.id >= 6) {
      const particleCount = tier.id >= 7 ? 4 : 2;
      for (let i = 0; i < particleCount; i++) {
        const angle = time * 0.001 + (i * Math.PI * 2) / particleCount;
        const dist = tier.radius + 12 + Math.sin(time * 0.003 + i) * 4;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        const size = 1.5 + Math.sin(time * 0.005 + i * 1.5) * 0.5;

        graphics.fillStyle(color, 0.5);
        graphics.fillCircle(px, py, size);
      }
    }
  }
}
