'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ritualChain } from '@/lib/wallet/ritual';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmpmixoms00fb0cjux31kt6m7"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#a855f7',
          showWalletLoginFirst: true,
        },
        defaultChain: ritualChain,
        supportedChains: [ritualChain],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
