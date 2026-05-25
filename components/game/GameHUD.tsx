'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { EVOLUTION_TIERS } from '@game/config/evolution';
import { EventBus } from '@game/EventBus';

export function GameHUD() {
  const score = useGameStore((s) => s.score);
  const highestTier = useGameStore((s) => s.highestTier);
  const chainCount = useGameStore((s) => s.chainCount);
  const chainMultiplier = useGameStore((s) => s.chainMultiplier);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const nextBallTierId = useGameStore((s) => s.nextBallTierId);
  const [showChain, setShowChain] = useState(false);

  useEffect(() => {
    const onScore = (data: { score: number; highestTier: number }) => {
      useGameStore.getState().setScore(data.score);
      useGameStore.getState().setHighestTier(data.highestTier);
    };

    const onChain = (data: { count: number; multiplier: number }) => {
      useGameStore.getState().setChain(data.count, data.multiplier);
      setShowChain(true);
    };

    const onChainEnd = () => {
      useGameStore.getState().clearChain();
      setShowChain(false);
    };

    const onNextBall = (tier: { id: number }) => {
      useGameStore.getState().setNextBallTier(tier.id);
    };

    const onGameOver = (stats: any) => {
      useGameStore.getState().setGameOver(stats);
    };

    EventBus.on('score-changed', onScore);
    EventBus.on('chain', onChain);
    EventBus.on('chain-end', onChainEnd);
    EventBus.on('next-ball-changed', onNextBall);
    EventBus.on('game-over', onGameOver);

    return () => {
      EventBus.off('score-changed', onScore);
      EventBus.off('chain', onChain);
      EventBus.off('chain-end', onChainEnd);
      EventBus.off('next-ball-changed', onNextBall);
      EventBus.off('game-over', onGameOver);
    };
  }, []);

  if (isGameOver) return null;

  const nextTier = EVOLUTION_TIERS[nextBallTierId - 1];
  const nextColor = nextTier?.colors[0] || '#fff';

  return (
    <div className="absolute inset-x-0 top-0 p-3 pointer-events-none z-20">
      <div className="flex items-start justify-between gap-2">
        {/* SCORE */}
        <div className="game-pill game-pill-score">
          <span className="text-[10px] uppercase tracking-wider opacity-70">Score</span>
          <span className="text-lg leading-none tabular-nums">{score.toLocaleString()}</span>
        </div>

        {/* CHAIN */}
        {showChain && chainCount > 1 && (
          <div className="game-pill game-pill-chain animate-bounce-in">
            <span className="text-2xl leading-none font-display">{chainMultiplier}x</span>
          </div>
        )}

        {/* NEXT BALL */}
        <div className="game-pill game-pill-next">
          <span className="text-[10px] uppercase tracking-wider opacity-60">Next</span>
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: nextColor,
              boxShadow: `0 0 12px ${nextColor}80, inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)`,
            }}
          />
        </div>
      </div>

      {/* HIGHEST TIER BADGE */}
      {highestTier > 0 && (
        <div className="mt-2 flex justify-center">
          <div
            className="game-pill game-pill-tier text-[10px]"
            style={{
              borderColor: `${EVOLUTION_TIERS[highestTier - 1]?.colors[0]}60`,
              boxShadow: `0 2px 0 rgba(0,0,0,0.2), 0 0 20px ${EVOLUTION_TIERS[highestTier - 1]?.colors[0]}20`,
            }}
          >
            <span style={{ color: EVOLUTION_TIERS[highestTier - 1]?.colors[0] }}>
              {EVOLUTION_TIERS[highestTier - 1]?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
