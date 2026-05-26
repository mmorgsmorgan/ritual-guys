'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useGameStore } from '@/lib/store/gameStore';
import { EVOLUTION_TIERS } from '@game/config/evolution';
import { RITUAL_GUYS_ADDRESS, RITUAL_GUYS_ABI, ritualChain } from '@/lib/wallet/ritual';

export function EndScreen() {
  const isGameOver = useGameStore((s) => s.isGameOver);
  const gameStats = useGameStore((s) => s.gameStats);
  const resetGame = useGameStore((s) => s.resetGame);
  const { isConnected } = useAccount();

  const [displayName, setDisplayName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const { writeContract, data: txHash, isPending: isSigning, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: ritualChain.id,
  });

  if (!isGameOver || !gameStats) return null;

  const highestEvolution = EVOLUTION_TIERS[gameStats.highestTier - 1];
  const color = highestEvolution?.colors[0] || '#FFD700';
  const rarity = gameStats.highestTier <= 2 ? 'COMMON' : gameStats.highestTier <= 4 ? 'RARE' : gameStats.highestTier <= 6 ? 'EPIC' : 'LEGENDARY';

  const handleSubmitScore = () => {
    if (!displayName.trim() || !isConnected) return;
    setSubmitted(true);
    writeContract({
      address: RITUAL_GUYS_ADDRESS,
      abi: RITUAL_GUYS_ABI,
      functionName: 'submitScore',
      args: [displayName.trim(), BigInt(gameStats.score), BigInt(gameStats.highestTier)],
      chainId: ritualChain.id,
    });
  };

  const handlePlayAgain = () => {
    setSubmitted(false);
    setSkipped(false);
    setDisplayName('');
    resetGame();
    window.location.reload();
  };

  const showScoreForm = !isConfirmed && !skipped;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(27,10,60,0.95) 0%, rgba(0,0,0,0.98) 100%)',
        pointerEvents: 'auto',
      }}
    >
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-pulse-glow"
        style={{ background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }}
      />

      <div
        className="relative z-10 game-card p-6 max-w-[320px] w-full mx-4 text-center animate-slide-up"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex justify-center mb-4">
          <div className="game-pill text-[10px] tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${color}40, ${color}20)`,
              borderColor: `${color}60`,
              color,
            }}>
            {rarity}
          </div>
        </div>

        <div className="relative mx-auto w-20 h-20 mb-4" style={{ pointerEvents: 'none' }}>
          <div
            className="absolute inset-[-16px] rounded-full"
            style={{ background: color, filter: 'blur(20px)', opacity: 0.4 }}
          />
          <div
            className="relative w-20 h-20 rounded-full animate-float-bounce"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 30px ${color}60, inset 0 -8px 16px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.3)`,
            }}
          />
        </div>

        <h2 className="font-display text-3xl text-white text-outline mb-1">
          {highestEvolution?.title || 'UNKNOWN'}
        </h2>
        <div className="text-xs font-body font-bold uppercase tracking-widest mb-5 opacity-60"
          style={{ color }}>
          {highestEvolution?.feeling || 'mysterious'}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { val: gameStats.score.toLocaleString(), label: 'SCORE' },
            { val: String(gameStats.mergesPerformed), label: 'MERGES' },
            { val: String(gameStats.discoveredTiers.length), label: 'TIERS' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl py-2 px-1"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="font-display text-lg text-white leading-tight">
                {s.val}
              </div>
              <div className="text-[8px] font-body font-bold text-white/40 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {showScoreForm && (
          <div className="mb-4 space-y-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 32))}
              placeholder="Enter your name"
              maxLength={32}
              disabled={isSigning || isConfirming}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-body text-sm placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              style={{ pointerEvents: 'auto' }}
            />

            {writeError && !isSigning && (
              <p className="text-red-400 text-xs font-body">
                {writeError.message.includes('User rejected') ? 'Transaction rejected — try again' : 'Failed to submit — try again'}
              </p>
            )}

            <button
              onClick={handleSubmitScore}
              disabled={!displayName.trim() || isSigning || isConfirming}
              className="w-full py-3 rounded-full font-display text-lg text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                pointerEvents: 'auto',
                background: !displayName.trim() ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${color}, ${color}CC)`,
                boxShadow: !displayName.trim() ? 'none' : `0 4px 0 rgba(0,0,0,0.3), 0 6px 20px ${color}40`,
                border: '3px solid rgba(255,255,255,0.2)',
              }}
            >
              {isSigning ? 'CONFIRM IN WALLET...' : isConfirming ? 'SUBMITTING...' : 'SAVE SCORE'}
            </button>

            <button
              onClick={() => setSkipped(true)}
              disabled={isSigning || isConfirming}
              className="w-full py-2 text-xs font-body font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider disabled:opacity-30"
              style={{ pointerEvents: 'auto' }}
            >
              Skip & Play Again
            </button>
          </div>
        )}

        {isConfirmed && (
          <div className="mb-4 py-3 rounded-xl text-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-emerald-400 font-display text-sm">SCORE SUBMITTED ON-CHAIN</p>
          </div>
        )}

        {(isConfirmed || skipped) && (
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 rounded-full font-display text-xl text-white"
            style={{
              pointerEvents: 'auto',
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              boxShadow: `0 4px 0 rgba(0,0,0,0.3), 0 6px 20px ${color}40`,
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            PLAY AGAIN
          </button>
        )}

        <a
          href="/leaderboard"
          className="block w-full py-2 mt-2 text-xs font-body font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider text-center"
          style={{ pointerEvents: 'auto' }}
        >
          View Leaderboard
        </a>
      </div>
    </div>
  );
}
