import { MERGE_CONFIG } from '@game/config/physics';
import { EventBus } from '@game/EventBus';

export class ChainReactionSystem {
  chainCount = 0;
  lastMergeTime = 0;

  get multiplier(): number {
    return Math.min(this.chainCount, MERGE_CONFIG.maxChainMultiplier);
  }

  onMerge(time: number) {
    if (time - this.lastMergeTime < MERGE_CONFIG.chainWindowMs) {
      this.chainCount++;
    } else {
      this.chainCount = 1;
    }
    this.lastMergeTime = time;

    if (this.chainCount > 1) {
      EventBus.emit('chain', { count: this.chainCount, multiplier: this.multiplier });
    }
  }

  update(time: number) {
    if (this.chainCount > 0 && time - this.lastMergeTime > MERGE_CONFIG.chainWindowMs) {
      this.chainCount = 0;
      EventBus.emit('chain-end');
    }
  }

  reset() {
    this.chainCount = 0;
    this.lastMergeTime = 0;
  }
}
