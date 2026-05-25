import { EventBus } from '@game/EventBus';

export class ScoreSystem {
  score = 0;
  highestTier = 0;
  ballsDropped = 0;
  mergesPerformed = 0;
  discoveredTiers = new Set<number>();

  addMergeScore(tierId: number, chainMultiplier: number): number {
    const points = tierId * tierId * 100 * Math.max(chainMultiplier, 1);
    this.score += points;
    this.mergesPerformed++;

    if (tierId > this.highestTier) {
      this.highestTier = tierId;
    }

    if (!this.discoveredTiers.has(tierId)) {
      this.discoveredTiers.add(tierId);
      EventBus.emit('tier-discovered', tierId);
    }

    EventBus.emit('score-changed', {
      score: this.score,
      highestTier: this.highestTier,
      points,
    });

    return points;
  }

  onBallDropped() {
    this.ballsDropped++;
  }

  getStats() {
    return {
      score: this.score,
      highestTier: this.highestTier,
      ballsDropped: this.ballsDropped,
      mergesPerformed: this.mergesPerformed,
      discoveredTiers: Array.from(this.discoveredTiers),
    };
  }

  reset() {
    this.score = 0;
    this.highestTier = 0;
    this.ballsDropped = 0;
    this.mergesPerformed = 0;
    this.discoveredTiers.clear();
  }
}
