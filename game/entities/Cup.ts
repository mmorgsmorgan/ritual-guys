import Phaser from 'phaser';
import { PHYSICS_CONFIG, GAME_WIDTH } from '@game/config/physics';

export class Cup {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.createWalls();
    this.sprite = this.createVisual();
  }

  private createWalls() {
    const { wallThickness, floorY, leftX, rightX, topOpenY } = PHYSICS_CONFIG.cup;
    const wallHeight = floorY - topOpenY;

    this.scene.matter.add.rectangle(
      leftX - wallThickness / 2,
      topOpenY + wallHeight / 2,
      wallThickness,
      wallHeight,
      { isStatic: true, label: 'wall-left', friction: 0.05 },
    );

    this.scene.matter.add.rectangle(
      rightX + wallThickness / 2,
      topOpenY + wallHeight / 2,
      wallThickness,
      wallHeight,
      { isStatic: true, label: 'wall-right', friction: 0.05 },
    );

    this.scene.matter.add.rectangle(
      GAME_WIDTH / 2,
      floorY + wallThickness / 2,
      rightX - leftX + wallThickness * 2,
      wallThickness,
      { isStatic: true, label: 'wall-floor', friction: 0.3 },
    );
  }

  private createVisual(): Phaser.GameObjects.Image {
    const { leftX, rightX, topOpenY } = PHYSICS_CONFIG.cup;
    const centerX = (leftX + rightX) / 2;
    const size = 680;
    const centerY = topOpenY - 0.169 * size + size / 2;

    const img = this.scene.add.image(centerX, centerY, 'cup');
    img.setDepth(1);
    img.setDisplaySize(size, size);

    return img;
  }
}
