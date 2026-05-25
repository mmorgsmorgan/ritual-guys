'use client';

import { useEffect, useState } from 'react';
import { EVOLUTION_TIERS } from '@game/config/evolution';

interface DiscoveryEntry {
  id: string;
  tier: number;
  wallet_address: string;
  display_name: string | null;
  discovered_at: string;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DiscoveryFeed() {
  const [discoveries, setDiscoveries] = useState<DiscoveryEntry[]>([]);

  useEffect(() => {
    fetch('/api/scores?period=daily&limit=20')
      .then((res) => res.json())
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-2">
      {discoveries.length === 0 ? (
        <div className="text-center py-8 text-white/20 font-mono text-xs">
          Discoveries will appear here as players evolve new tiers
        </div>
      ) : (
        discoveries.map((d) => {
          const tier = EVOLUTION_TIERS[d.tier - 1];
          const color = tier?.colors[0] || '#666';
          const name = d.display_name || truncateAddress(d.wallet_address);

          return (
            <div key={d.id} className="glass rounded-lg px-3 py-2 flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full shrink-0"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}40`,
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white/60 font-mono">{name}</span>
                <span className="text-xs text-white/30"> discovered </span>
                <span className="text-xs font-mono" style={{ color }}>
                  {tier?.title}
                </span>
              </div>
              <div className="text-[10px] text-white/20 font-mono shrink-0">
                {timeAgo(d.discovered_at)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
