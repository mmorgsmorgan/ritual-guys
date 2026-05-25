import Link from 'next/link';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen halftone">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between mb-8">
          <Link href="/" className="font-display text-xl text-candy-yellow text-outline-sm">
            RITUAL GUYS
          </Link>
          <Link
            href="/play"
            className="sticker-yellow btn-bouncy px-6 py-2 font-display text-lg"
          >
            PLAY
          </Link>
        </nav>

        <h1 className="font-display text-5xl text-white text-outline text-center mb-2">
          LEADERBOARD
        </h1>
        <p className="text-center text-white/50 font-body mb-8">
          Top scores from the community 🏆
        </p>

        <LeaderboardTable />
      </div>
    </main>
  );
}
