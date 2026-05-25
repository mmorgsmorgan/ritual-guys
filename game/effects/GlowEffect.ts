import Phaser from 'phaser';
import { type EvolutionTier, hexToNumber } from '@game/config/evolution';

export class GlowEffect {
  static render(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    tier: EvolutionTier,
    time: number,
  ) {
    if (tier.glowIntensity <= 0) return;

    const pulse = 0.7 + Math.sin(time * 0.003) * 0.3;
    const baseRadius = tier.radius * 1.4;
    const color = hexToNumber(tier.colors[0]);

    graphics.fillStyle(color, tier.glowIntensity * 0.18 * pulse);
    graphics.fillCircle(x, y, baseRadius + 6);

    if (tier.id >= 5) {
      graphics.fillStyle(color, tier.glowIntensity * 0.09 * pulse);
      graphics.fillCircle(x, y, baseRadius + 14);
    }

    if (tier.id >= 7) {
      graphics.fillStyle(color, tier.glowIntensity * 0.05 * pulse);
      graphics.fillCircle(x, y, baseRadius + 24);
    }
  }
}
