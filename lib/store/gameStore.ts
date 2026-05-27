import { create } from 'zustand';

interface GameStats {
  score: number;
  highestTier: number;
  ballsDropped: number;
  mergesPerformed: number;
  discoveredTiers: number[];
}

interface GameState {
  score: number;
  highestTier: number;
  chainMultiplier: number;
  chainCount: number;
  isGameOver: boolean;
  gameStats: GameStats | null;
  nextBallTierId: number;
  gamesPlayed: number;

  setScore: (score: number) => void;
  setHighestTier: (tier: number) => void;
  setChain: (count: number, multiplier: number) => void;
  clearChain: () => void;
  setGameOver: (stats: GameStats) => void;
  setNextBallTier: (tierId: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  highestTier: 0,
  chainMultiplier: 1,
  chainCount: 0,
  isGameOver: false,
  gameStats: null,
  nextBallTierId: 1,
  gamesPlayed: 0,

  setScore: (score) => set({ score }),
  setHighestTier: (tier) => set({ highestTier: tier }),
  setChain: (count, multiplier) => set({ chainCount: count, chainMultiplier: multiplier }),
  clearChain: () => set({ chainCount: 0, chainMultiplier: 1 }),
  setGameOver: (stats) => {
    console.log('[gameStore] setGameOver called', new Error().stack?.split('\n').slice(1, 4));
    set({ isGameOver: true, gameStats: stats });
  },
  setNextBallTier: (tierId) => set({ nextBallTierId: tierId }),
  resetGame: () => {
    console.log('[gameStore] resetGame called');
    set((state) => ({
      score: 0,
      highestTier: 0,
      chainMultiplier: 1,
      chainCount: 0,
      isGameOver: false,
      gameStats: null,
      nextBallTierId: 1,
      gamesPlayed: state.gamesPlayed + 1,
    }));
  },
}));
