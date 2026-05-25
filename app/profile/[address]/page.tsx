import Link from 'next/link';
import { EVOLUTION_TIERS } from '@game/config/evolution';

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

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

        {/* Profile card */}
        <div className="sticker p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-full glossy font-display text-2xl text-white flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #9B59B6, #FF6B9D)',
                border: '3px solid #fff',
                boxShadow: '4px 4px 0px #000',
              }}
            >
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl text-white text-outline-sm">
                {truncateAddress(address)}
              </h1>
              <span className="badge text-candy-cyan border-candy-cyan bg-candy-cyan/20 text-[10px]">
                PLAYER
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '-', label: 'GAMES' },
              { val: '-', label: 'BEST SCORE' },
              { val: '-', label: 'HIGHEST TIER' },
            ].map((s) => (
              <div key={s.label} className="sticker-sm p-3 text-center">
                <div className="font-display text-2xl text-white text-outline-sm">{s.val}</div>
                <div className="text-[9px] font-body font-bold text-white/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Discoveries */}
        <h2 className="font-display text-2xl text-white text-outline-sm mb-4">DISCOVERIES</h2>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {EVOLUTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="sticker-sm p-3 text-center opacity-40"
            >
              <div
                className="w-10 h-10 rounded-full mx-auto mb-1 glossy"
                style={{
                  backgroundColor: tier.colors[0],
                  border: '2px solid #fff',
                  boxShadow: '2px 2px 0px #000',
                }}
              />
              <div className="text-[10px] font-body font-bold text-white/50">
                {tier.title}
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-white text-outline-sm mb-4">RECENT RUNS</h2>
        <div className="sticker p-6 text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-body font-bold text-white/40 text-sm">
            Connect Supabase to see run history
          </div>
        </div>
      </div>
    </main>
  );
}
