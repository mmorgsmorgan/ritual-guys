export interface EvolutionTier {
  id: number;
  name: string;
  title: string;
  radius: number;
  density: number;
  colors: string[];
  scoreValue: number;
  glowIntensity: number;
  feeling: string;
}

export const EVOLUTION_TIERS: EvolutionTier[] = [
  {
    id: 1,
    name: 'origin',
    title: 'Origin',
    radius: 26,
    density: 0.001,
    colors: ['#FF6B6B', '#D9D9D9', '#2A123D'],
    scoreValue: 100,
    glowIntensity: 0,
    feeling: 'common',
  },
  {
    id: 2,
    name: 'mutation',
    title: 'Mutation',
    radius: 36,
    density: 0.0015,
    colors: ['#7B2FBE', '#4B1D67', '#D16BA5', '#F2F2F2'],
    scoreValue: 400,
    glowIntensity: 0,
    feeling: 'unstable',
  },
  {
    id: 3,
    name: 'ascension',
    title: 'Ascension',
    radius: 46,
    density: 0.002,
    colors: ['#2563EB', '#307287', '#1E40AF'],
    scoreValue: 900,
    glowIntensity: 0.2,
    feeling: 'powerful',
  },
  {
    id: 4,
    name: 'elite',
    title: 'Elite',
    radius: 58,
    density: 0.003,
    colors: ['#FF8C00', '#6B4F3A'],
    scoreValue: 1600,
    glowIntensity: 0.3,
    feeling: 'prestigious',
  },
  {
    id: 5,
    name: 'energy',
    title: 'Energy',
    radius: 70,
    density: 0.004,
    colors: ['#39FF14', '#BC13FE'],
    scoreValue: 2500,
    glowIntensity: 0.5,
    feeling: 'radioactive',
  },
  {
    id: 6,
    name: 'celestial',
    title: 'Celestial',
    radius: 84,
    density: 0.005,
    colors: ['#00E5FF', '#7DD3FC'],
    scoreValue: 3600,
    glowIntensity: 0.6,
    feeling: 'transcendent',
  },
  {
    id: 7,
    name: 'divine',
    title: 'Divine',
    radius: 98,
    density: 0.007,
    colors: ['#FFD700', '#F5C542'],
    scoreValue: 4900,
    glowIntensity: 0.8,
    feeling: 'legendary',
  },
  {
    id: 8,
    name: 'mythic',
    title: 'Mythic',
    radius: 115,
    density: 0.01,
    colors: ['#FF1493', '#C084FC'],
    scoreValue: 6400,
    glowIntensity: 1.0,
    feeling: 'sacred',
  },
];

export const SPAWN_WEIGHTS = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3];

export function getRandomSpawnTier(): EvolutionTier {
  const tierId = SPAWN_WEIGHTS[Math.floor(Math.random() * SPAWN_WEIGHTS.length)];
  return EVOLUTION_TIERS[tierId - 1];
}

export function getRandomColor(tier: EvolutionTier): string {
  return tier.colors[Math.floor(Math.random() * tier.colors.length)];
}

export function getTier(id: number): EvolutionTier | undefined {
  return EVOLUTION_TIERS[id - 1];
}

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}
