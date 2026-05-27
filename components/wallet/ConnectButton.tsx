'use client';

import { usePrivy } from '@privy-io/react-auth';

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  if (!ready) {
    return (
      <button
        disabled
        className="sticker-sm btn-bouncy px-4 py-2 font-body font-bold text-xs opacity-40"
      >
        <span className="text-candy-cyan">Loading…</span>
      </button>
    );
  }

  const address = user?.wallet?.address;
  const connected = authenticated && !!address;

  return (
    <button
      onClick={connected ? logout : login}
      className="sticker-sm btn-bouncy px-4 py-2 font-body font-bold text-xs"
    >
      {connected ? (
        <span className="flex items-center gap-2 text-candy-green">
          <span className="text-sm">🟢</span>
          {truncate(address)}
        </span>
      ) : (
        <span className="text-candy-cyan">Connect Wallet</span>
      )}
    </button>
  );
}
