import Phaser from 'phaser';
import { type EvolutionTier, hexToNumber } from '@game/config/evolution';
import { PHYSICS_CONFIG } from '@game/config/physics';
import { calculateDeformation } from '@game/effects/SquashStretch';

function darkenColor(hex: number, amount: number): number {
  return Phaser.Display.Color.IntegerToColor(hex).darken(amount).color;
}

function lightenColor(hex: number, amount: number): number {
  return Phaser.Display.Color.IntegerToColor(hex).lighten(amount).color;
}

export class Ball {
  scene: Phaser.Scene;
  body: MatterJS.BodyType;
  container: Phaser.GameObjects.Container;
  tier: EvolutionTier;
  colorNum: number;
  isMarkedForRemoval = false;
  isPreview: boolean;
  lastImpactForce = 0;
  lastImpactTime = 0;
  createdAt: number;

  constructor(scene: Phaser.Scene, x: number, y: number, tier: EvolutionTier, isStatic = false) {
    this.scene = scene;
    this.tier = tier;
    this.isPreview = isStatic;
    this.colorNum = hexToNumber(tier.colors[0]);
    this.createdAt = scene.time.now;

    this.body = scene.matter.add.circle(x, y, tier.radius, {
      ...PHYSICS_CONFIG.ball,
      isStatic,
      label: `ball-${tier.id}`,
      density: tier.density,
    });
    (this.body as any).ballRef = this;

    const r = tier.radius;
    const baseColor = this.colorNum;
    const dark = darkenColor(baseColor, 45);
    const mid = darkenColor(baseColor, 20);
    const light = lightenColor(baseColor, 50);

    // 1. Ground shadow — offset down-right
    const shadow = scene.add.circle(r * 0.1, r * 0.15, r * 0.88, 0x000000);
    shadow.setAlpha(0.3);

    // 2. Main body
    const mainCircle = scene.add.circle(0, 0, r, baseColor);

    // 3. Ambient occlusion rim — dark ring at full radius, fakes edge darkening
    const aoRim = scene.add.circle(0, 0, r);
    aoRim.setStrokeStyle(r * 0.18, dark, 0.35);
    aoRim.setFillStyle(0x000000, 0);

    // 4. Bottom hemisphere shadow — strong lower half darkening
    const bottomDark = scene.add.circle(0, r * 0.22, r * 0.7, dark);
    bottomDark.setAlpha(0.4);

    // 5. Mid-tone transition — blends between dark bottom and light top
    const midTone = scene.add.circle(-r * 0.05, -r * 0.05, r * 0.7, mid);
    midTone.setAlpha(0.15);

    // 6. Top highlight — large bright zone upper-left
    const highlight = scene.add.circle(-r * 0.18, -r * 0.2, r * 0.5, light);
    highlight.setAlpha(0.5);

    // 7. Primary specular — bright white dot
    const spec = scene.add.circle(-r * 0.2, -r * 0.25, r * 0.16, 0xffffff);
    spec.setAlpha(0.9);

    // 8. Secondary specular — small accent
    const spec2 = scene.add.circle(-r * 0.06, -r * 0.36, r * 0.07, 0xffffff);
    spec2.setAlpha(0.55);

    this.container = scene.add.container(x, y, [
      shadow, mainCircle, aoRim, bottomDark, midTone, highlight, spec, spec2,
    ]);
    this.container.setDepth(tier.id + 10);
    this.container.setAlpha(isStatic ? 0.65 : 1);
  }

  update(time: number, _delta: number) {
    if (this.isMarkedForRemoval) return;
    const pos = this.body.position;
    const vel = this.body.velocity;
    const deform = calculateDeformation(
      vel.y,
      this.lastImpactForce,
      (time - this.lastImpactTime) / 1000,
    );
    this.container.setPosition(pos.x, pos.y);
    this.container.setScale(deform.scaleX, deform.scaleY);
  }

  onCollision(force: number) {
    this.lastImpactForce = force;
    this.lastImpactTime = this.scene.time.now;
  }

  destroy() {
    this.isMarkedForRemoval = true;
    this.container.destroy();
    this.scene.matter.world.remove(this.body);
  }
}
