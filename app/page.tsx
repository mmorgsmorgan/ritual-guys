import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-dvh relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center w-full max-w-sm mx-auto">
        <h1 className="font-display text-6xl leading-none mb-4">
          <span className="text-candy-yellow text-outline">RITUAL</span>
          <br />
          <span className="text-candy-pink text-outline">GUYS</span>
        </h1>

        <div className="flex justify-center gap-2 mb-5">
          {['DROP', 'MERGE', 'EVOLVE'].map((w) => (
            <span
              key={w}
              className="px-3 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
            >
              {w}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/50 font-body mb-8 leading-relaxed">
          A community merge game. Match balls to unlock rare evolutions.
          Chain combos. Flex on the leaderboard.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/play"
            className="w-full py-4 rounded-full font-display text-xl text-white text-center transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 8px 30px rgba(168,85,247,0.4)',
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            PLAY NOW
          </Link>
          <Link
            href="/leaderboard"
            className="w-full py-3 rounded-full font-display text-base text-white/70 text-center transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,255,255,0.12)',
            }}
          >
            LEADERBOARD
          </Link>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          {[
            { label: 'DROP', desc: 'Tap to drop', color: '#FFD93D' },
            { label: 'MERGE', desc: 'Match to evolve', color: '#FF5CAD' },
            { label: 'EVOLVE', desc: 'Chain combos', color: '#22D3EE' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: item.color, boxShadow: `0 0 12px ${item.color}40` }}
              />
              <div className="text-[10px] font-body font-bold text-white/40 uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
