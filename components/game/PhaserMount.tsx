'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store/gameStore';

export default function PhaserMount() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);

  useEffect(() => {
    let cancelled = false;
    console.log('[PhaserMount] effect run, gamesPlayed:', gamesPlayed);

    if (gameRef.current) {
      console.log('[PhaserMount] destroying previous game before recreate');
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    import('@game/main').then(({ createGame }) => {
      if (cancelled || !containerRef.current) return;
      console.log('[PhaserMount] creating new Phaser game');
      gameRef.current = createGame(containerRef.current);
    });

    return () => {
      cancelled = true;
      console.log('[PhaserMount] cleanup, destroying game');
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gamesPlayed]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative z-10 [&_canvas]:rounded-xl [&_canvas]:w-full [&_canvas]:h-full"
    />
  );
}
