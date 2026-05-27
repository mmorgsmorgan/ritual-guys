'use client';

import dynamic from 'next/dynamic';
import { GameHUD } from './GameHUD';
import { EndScreen } from './EndScreen';
import { useGameStore } from '@/lib/store/gameStore';

const PhaserMount = dynamic(() => import('./PhaserMount'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center animate-bounce-hover">
        <div className="font-display text-4xl text-candy-yellow text-outline">
          RITUAL GUYS
        </div>
        <div className="text-sm font-body font-bold text-white/50 mt-3">
          loading game...
        </div>
      </div>
    </div>
  ),
});

export default function GameCanvas() {
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);

  return (
    <div
      className="relative w-full max-w-[500px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden"
      style={{
        background: '#0D0520',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.15), 0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Faded character background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/bg-character.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
      />
      <PhaserMount key={gamesPlayed} />
      <GameHUD />
      <EndScreen key={gamesPlayed} />
    </div>
  );
}
