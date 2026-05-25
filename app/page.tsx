import Link from 'next/link';
import { EVOLUTION_TIERS } from '@game/config/evolution';

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden halftone">
      {/* Floating bg blobs */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-candy-pink/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-candy-blue/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-candy-purple/15 rounded-full blur-[80px] pointer-events-none" />

      {/* === HERO === */}
      <section className="relative z-10 text-center px-4 pt-12 pb-8 max-w-3xl mx-auto">
        {/* Title sticker */}
        <div className="inline-block mb-6">
          <h1 className="font-display text-7xl sm:text-9xl leading-none text-outline">
            <span className="text-candy-yellow">RITUAL</span>
            <br />
            <span className="text-candy-pink">GUYS</span>
          </h1>
        </div>

        {/* Tagline badge */}
        <div className="flex justify-center gap-2 mb-6">
          <span className="badge text-candy-yellow border-candy-yellow bg-candy-yellow/20">DROP</span>
          <span className="badge text-candy-pink border-candy-pink bg-candy-pink/20">MERGE</span>
          <span className="badge text-candy-cyan border-candy-cyan bg-candy-cyan/20">EVOLVE</span>
        </div>

        <p className="text-lg text-white/70 font-body mb-10 max-w-md mx-auto">
          A community merge game. Match balls to unlock rare evolutions.
          Chain combos. Flex on the leaderboard. <span className="text-candy-yellow font-bold">LFG!</span>
        </p>

        {/* BIG PLAY BUTTON */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/play"
            className="sticker-yellow btn-bouncy px-14 py-5 font-display text-3xl tracking-wide text-outline-sm inline-block"
          >
            PLAY NOW
          </Link>
          <Link
            href="/leaderboard"
            className="sticker btn-bouncy px-8 py-4 font-display text-xl text-candy-cyan"
          >
            LEADERBOARD
          </Link>
        </div>
      </section>

      {/* === HOW TO PLAY === */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-outline text-white mb-10">
          HOW TO PLAY
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { step: '01', title: 'DROP', desc: 'Click to drop balls into the cup!', color: 'sticker-yellow', emoji: '👇' },
            { step: '02', title: 'MERGE', desc: 'Match two same balls to evolve them!', color: 'sticker-pink', emoji: '💥' },
            { step: '03', title: 'EVOLVE', desc: 'Chain merges to discover legendaries!', color: 'sticker-blue', emoji: '✨' },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`${item.color} btn-bouncy p-6 text-center`}
              style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -2 : 2}deg)` }}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <div className="font-display text-3xl text-outline-sm text-white mb-2">
                {item.title}
              </div>
              <p className="text-sm font-body text-white/90 font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === EVOLUTION SHOWCASE === */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-outline text-white mb-3">
          EVOLUTIONS
        </h2>
        <p className="text-center text-white/50 font-body mb-10">
          8 tiers from <span className="text-candy-yellow font-bold">Origin</span> to{' '}
          <span className="text-candy-purple font-bold">Mythic</span>. Can you catch them all?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {EVOLUTION_TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className="sticker btn-bouncy p-4 text-center tilt-hover"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + Math.random())}deg)` }}
            >
              <div className="flex gap-1.5 justify-center mb-3">
                {tier.colors.map((color, ci) => (
                  <div
                    key={ci}
                    className="rounded-full glossy"
                    style={{
                      width: 20 + tier.id * 3,
                      height: 20 + tier.id * 3,
                      backgroundColor: color,
                      border: '3px solid #fff',
                      boxShadow: `3px 3px 0px #000, 0 0 ${tier.id * 3}px ${color}80`,
                    }}
                  />
                ))}
              </div>
              <div className="font-display text-lg text-white text-outline-sm">
                {tier.title}
              </div>
              <div className="text-[10px] font-body text-white/50 font-bold uppercase mt-1">
                {tier.id <= 2 ? 'Common' : tier.id <= 4 ? 'Rare' : tier.id <= 6 ? 'Epic' : 'Legendary'}
              </div>
              <span
                className="badge mt-2 text-[9px]"
                style={{
                  color: tier.colors[0],
                  borderColor: tier.colors[0],
                  backgroundColor: `${tier.colors[0]}20`,
                }}
              >
                LVL {tier.id}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="sticker-purple btn-bouncy inline-block px-8 py-3 font-display text-lg text-white"
          >
            VIEW GALLERY →
          </Link>
        </div>
      </section>

      {/* === STATS === */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: '8', label: 'EVOLUTIONS', color: 'sticker-yellow' },
            { value: '5x', label: 'MAX CHAIN', color: 'sticker-pink' },
            { value: '∞', label: 'REPLAYS', color: 'sticker-blue' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} btn-bouncy p-4`}>
              <div className="font-display text-4xl text-outline text-white">
                {stat.value}
              </div>
              <div className="text-xs font-body font-bold text-white/80 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="relative z-10 text-center py-8 px-4">
        <div className="sticker inline-block px-6 py-3 mb-4">
          <span className="font-display text-sm text-candy-yellow">
            community culture became a living game ✨
          </span>
        </div>
        <div className="flex justify-center gap-6 mt-3">
          {['Play', 'Leaderboard', 'Gallery'].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-sm font-body font-bold text-white/50 hover:text-candy-yellow transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
