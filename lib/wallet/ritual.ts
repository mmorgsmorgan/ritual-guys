import { defineChain, createPublicClient, http, type Address } from 'viem';

export const ritualChain = defineChain({
  id: 1979,
  name: 'Ritual Chain',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ritualfoundation.org'] },
  },
  blockExplorers: {
    default: { name: 'Ritual Explorer', url: 'https://explorer.ritualfoundation.org' },
  },
});

export const RITUAL_GUYS_ADDRESS = '0xD3104401a0907736b8a94eFeA9144E3F145f4C24' as Address;

export const ritualClient = createPublicClient({
  chain: ritualChain,
  transport: http(),
});

export const RITUAL_GUYS_ABI = [
  {
    name: 'registerPlayer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'startGame',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'submitScore',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'displayName', type: 'string' },
      { name: 'score', type: 'uint256' },
      { name: 'highestTier', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'isRegistered',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'getScoreCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getScores',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'player', type: 'address' },
          { name: 'displayName', type: 'string' },
          { name: 'score', type: 'uint256' },
          { name: 'highestTier', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'players',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'registered', type: 'bool' },
      { name: 'gamesPlayed', type: 'uint256' },
      { name: 'highScore', type: 'uint256' },
    ],
  },
] as const;
