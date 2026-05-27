'use client';

import { useEffect, useRef } from 'react';

export default function PhaserMount() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;
    let cancelled = false;

    import('@game/main').then(({ createGame }) => {
      if (cancelled || !containerRef.current || gameRef.current) return;
      gameRef.current = createGame(containerRef.current);
    });

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative z-10 [&_canvas]:rounded-xl [&_canvas]:w-full [&_canvas]:h-full"
    />
  );
}
