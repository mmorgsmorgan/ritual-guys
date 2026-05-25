import Link from 'next/link';
import { EVOLUTION_TIERS } from '@game/config/evolution';

export default function GalleryPage() {
  return (
    <main className="min-h-screen halftone">
      <div className="max-w-3xl mx-auto px-4 py-6">
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
          EVOLUTION GALLERY
        </h1>
        <p className="text-center text-white/50 font-body mb-10">
          All 8 tiers. <span className="text-candy-pink font-bold">Collect them all!</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {EVOLUTION_TIERS.map((tier, i) => {
            const rarity = tier.id <= 2 ? 'Common' : tier.id <= 4 ? 'Rare' : tier.id <= 6 ? 'Epic' : 'Legendary';
            const rarityColor = tier.id <= 2 ? '#C0C0C0' : tier.id <= 4 ? '#4D96FF' : tier.id <= 6 ? '#9B59B6' : '#FFD93D';

            return (
              <div
                key={tier.id}
                className="sticker btn-bouncy p-5 tilt-hover"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1)}deg)` }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex gap-2">
                    {tier.colors.map((color, ci) => (
                      <div
                        key={ci}
                        className="rounded-full glossy"
                        style={{
                          width: 28 + tier.id * 3,
                          height: 28 + tier.id * 3,
                          backgroundColor: color,
                          border: '3px solid #fff',
                          boxShadow: `3px 3px 0px #000, 0 0 ${tier.id * 4}px ${color}60`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-[9px]" style={{ color: rarityColor, borderColor: rarityColor, backgroundColor: `${rarityColor}20` }}>
                        LVL {tier.id}
                      </span>
                      <span className="badge text-[9px]" style={{ color: rarityColor, borderColor: rarityColor, backgroundColor: `${rarityColor}20` }}>
                        {rarity}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-white text-outline-sm">
                      {tier.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-body font-bold text-white/50">
                  <span>Size: {tier.radius}px</span>
                  <span>Score: {tier.scoreValue.toLocaleString()}</span>
                  <span className={tier.id <= 2 ? 'text-candy-green' : tier.id === 3 ? 'text-candy-yellow' : 'text-candy-pink'}>
                    {tier.id <= 2 ? '✓ Spawns' : tier.id === 3 ? '⚡ Rare spawn' : '🔒 Merge only'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
