'use client';

import { ConnectButton as RainbowConnect } from '@rainbow-me/rainbowkit';

export function ConnectButton() {
  return (
    <RainbowConnect.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <button
            onClick={connected ? openAccountModal : openConnectModal}
            className="sticker-sm btn-bouncy px-4 py-2 font-body font-bold text-xs"
          >
            {connected ? (
              <span className="flex items-center gap-2 text-candy-green">
                <span className="text-sm">🟢</span>
                {account.displayName}
              </span>
            ) : (
              <span className="text-candy-cyan">Connect Wallet</span>
            )}
          </button>
        );
      }}
    </RainbowConnect.Custom>
  );
}
