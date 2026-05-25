'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { EVOLUTION_TIERS } from '@game/config/evolution';
import { RITUAL_GUYS_ADDRESS, RITUAL_GUYS_ABI, ritualChain } from '@/lib/wallet/ritual';

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function LeaderboardTable() {
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data: scoreCount, isLoading: countLoading, isError: countError } = useReadContract({
    address: RITUAL_GUYS_ADDRESS,
    abi: RITUAL_GUYS_ABI,
    functionName: 'getScoreCount',
    chainId: ritualChain.id,
  });

  const total = scoreCount !== undefined ? Number(scoreCount) : 0;

  const { data: rawScores, isLoading: scoresLoading, isError: scoresError } = useReadContract({
    address: RITUAL_GUYS_ADDRESS,
    abi: RITUAL_GUYS_ABI,
    functionName: 'getScores',
    args: [BigInt(page * limit), BigInt(limit)],
    chainId: ritualChain.id,
  });

  const isLoading = countLoading || scoresLoading;
  const isError = countError || scoresError;

  const scores = (rawScores as readonly {
    player: string;
    displayName: string;
    score: bigint;
    highestTier: bigint;
    timestamp: bigint;
  }[] | undefined) || [];

  const sorted = [...scores].sort((a, b) => (b.score > a.score ? 1 : b.score < a.score ? -1 : 0));
  const hasMore = total > (page + 1) * limit;

  return (
    <div>
      <div className="flex gap-2 mb-6 justify-center">
        <div className="sticker-yellow px-5 py-2 font-display text-sm text-white">
          ON-CHAIN SCORES
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="font-display text-xl text-white/40 animate-bounce-hover">
            Loading from Ritual Chain...
          </div>
        </div>
      ) : isError ? (
        <div className="sticker p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="font-display text-xl text-white text-outline-sm">Connection Error</div>
          <div className="text-sm font-body text-white/50 mt-2">
            Could not read from Ritual Chain. Try refreshing.
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="sticker p-8 text-center">
          <div className="text-4xl mb-3">🎮</div>
          <div className="font-display text-xl text-white text-outline-sm">No scores yet!</div>
          <div className="text-sm font-body text-white/50 mt-2">
            Be the first to play and claim #1!
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((entry, index) => {
            const tierIdx = Number(entry.highestTier) - 1;
            const tier = EVOLUTION_TIERS[tierIdx];
            const tierColor = tier?.colors[0] || '#666';
            const name = entry.displayName || truncateAddress(entry.player);
            const rank = page * limit + index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

            return (
              <div
                key={`${entry.player}-${Number(entry.timestamp)}-${index}`}
                className="sticker btn-bouncy px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 text-center shrink-0">
                  {medal ? (
                    <span className="text-2xl">{medal}</span>
                  ) : (
                    <span className="font-display text-lg text-white/40">
                      {rank}
                    </span>
                  )}
                </div>

                <div
                  className="w-8 h-8 rounded-full shrink-0 glossy"
                  style={{
                    backgroundColor: tierColor,
                    border: '2px solid #fff',
                    boxShadow: `2px 2px 0px #000, 0 0 8px ${tierColor}60`,
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body font-bold text-white truncate">
                    {name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="badge text-[8px]"
                      style={{ color: tierColor, borderColor: tierColor, backgroundColor: `${tierColor}20` }}
                    >
                      {tier?.title || 'Unknown'}
                    </span>
                    <span className="text-[8px] font-body text-white/30">
                      {truncateAddress(entry.player)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display text-xl text-white text-outline-sm tabular-nums leading-tight">
                    {Number(entry.score).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="sticker btn-bouncy px-4 py-2 font-display text-sm text-white disabled:opacity-30"
          >
            PREV
          </button>
          <span className="font-body text-sm text-white/40 self-center">
            Page {page + 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasMore}
            className="sticker btn-bouncy px-4 py-2 font-display text-sm text-white disabled:opacity-30"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}
