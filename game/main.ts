import Phaser from 'phaser';
import { BootScene } from '@game/scenes/BootScene';
import { PreloadScene } from '@game/scenes/PreloadScene';
import { GameScene } from '@game/scenes/GameScene';
import { GAME_WIDTH, GAME_HEIGHT, PHYSICS_CONFIG } from '@game/config/physics';

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'matter',
      matter: {
        gravity: PHYSICS_CONFIG.gravity,
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, GameScene],
  });
}
