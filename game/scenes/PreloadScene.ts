import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '@game/config/physics';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image('cup', '/cup.png');
  }

  create() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add.text(cx, cy - 40, 'RITUAL GUYS', {
      fontSize: '36px',
      fontFamily: "'Fredoka One', Impact, sans-serif",
      color: '#FFD93D',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(cx, cy + 10, 'loading...', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#a78bfa',
    }).setOrigin(0.5);

    this.time.delayedCall(500, () => {
      this.scene.start('GameScene');
    });
  }
}
