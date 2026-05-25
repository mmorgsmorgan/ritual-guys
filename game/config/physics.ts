export const GAME_WIDTH = 450;
export const GAME_HEIGHT = 800;

export const PHYSICS_CONFIG = {
  gravity: { x: 0, y: 1.2 },
  ball: {
    restitution: 0.2,
    friction: 0.15,
    frictionAir: 0.01,
    frictionStatic: 0.5,
    slop: 0.05,
  },
  cup: {
    wallThickness: 60,
    floorY: 740,
    leftX: 75,
    rightX: 375,
    topOpenY: 300,
    wallColor: 0xc9a0dc,
    wallAlpha: 0.9,
    cornerRadius: 16,
  },
  spawn: {
    y: 260,
    cooldownMs: 300,
    dropDelay: 80,
  },
  overflow: {
    y: 310,
    graceMs: 0,
  },
  maxVelocity: 10,
} as const;

export const MERGE_CONFIG = {
  chainWindowMs: 1000,
  maxChainMultiplier: 5,
  mergeAnimationMs: 200,
} as const;
