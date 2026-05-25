import GameCanvas from '@/components/game/GameCanvas';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { GameGate } from '@/components/game/GameGate';
import Link from 'next/link';

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center">
      <nav className="w-full max-w-[520px] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-candy-yellow text-outline-sm">
          RITUAL GUYS
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="text-xs font-body font-bold text-white/40 hover:text-candy-yellow transition-colors hidden sm:block"
          >
            Leaderboard
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="flex-1 w-full flex items-start justify-center pt-1 pb-8 px-3">
        <GameGate>
          <GameCanvas />
        </GameGate>
      </div>
    </main>
  );
}
