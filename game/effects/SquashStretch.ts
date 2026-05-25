export interface DeformState {
  scaleX: number;
  scaleY: number;
}

const VELOCITY_FACTOR = 0.012;
const IMPACT_FACTOR = 0.06;
const RECOVERY_SPEED = 10;

export function calculateDeformation(
  velocityY: number,
  impactForce: number,
  timeSinceImpact: number,
): DeformState {
  let stretchY = 1 + Math.abs(velocityY) * VELOCITY_FACTOR;
  let stretchX = 1 / stretchY;

  if (timeSinceImpact < 0.4) {
    const decay = Math.exp(-timeSinceImpact * RECOVERY_SPEED);
    const squash = Math.min(impactForce * IMPACT_FACTOR, 0.25) * decay;
    stretchY = stretchY - squash;
    stretchX = stretchX + squash * 0.5;
  }

  return {
    scaleX: Math.max(0.75, Math.min(1.3, stretchX)),
    scaleY: Math.max(0.75, Math.min(1.3, stretchY)),
  };
}
