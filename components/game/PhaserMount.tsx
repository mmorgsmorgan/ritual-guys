'use client';

import { useEffect, useRef } from 'react';

export default function PhaserMount() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    console.log('[PhaserMount] effect run, gameRef:', !!gameRef.current);
    if (gameRef.current || !containerRef.current) return;

    import('@game/main').then(({ createGame }) => {
      if (!containerRef.current || gameRef.current) return;
      console.log('[PhaserMount] creating new Phaser game');
      gameRef.current = createGame(containerRef.current);
    });

    return () => {
      console.log('[PhaserMount] cleanup, destroying game');
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
