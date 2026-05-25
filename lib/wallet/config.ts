import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base } from 'wagmi/chains';
import { http } from 'wagmi';
import { ritualChain } from './ritual';

export const wagmiConfig = getDefaultConfig({
  appName: 'Ritual Guys',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [ritualChain, mainnet, base],
  transports: {
    [ritualChain.id]: http('https://rpc.ritualfoundation.org'),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
