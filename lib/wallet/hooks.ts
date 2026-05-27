'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, type Abi, type Address, type Hex } from 'viem';
import { ritualChain, ritualClient } from './ritual';

export function useAccount() {
  const { authenticated, user, ready } = usePrivy();
  const address = user?.wallet?.address as Address | undefined;
  return {
    address,
    isConnected: ready && authenticated && !!address,
    isReady: ready,
  };
}

export function useConnectModal() {
  const { login } = usePrivy();
  return { openConnectModal: login };
}

type ReadArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  chainId?: number;
  query?: { enabled?: boolean };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useReadContract<T = any>(opts: ReadArgs) {
  const enabled = opts.query?.enabled ?? true;
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tick, setTick] = useState(0);

  const argsKey = useMemo(() => {
    try {
      return JSON.stringify(opts.args, (_k, v) =>
        typeof v === 'bigint' ? `__bn:${v.toString()}` : v,
      );
    } catch {
      return String(opts.args);
    }
  }, [opts.args]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    ritualClient
      .readContract({
        address: opts.address,
        abi: opts.abi,
        functionName: opts.functionName,
        args: opts.args as readonly unknown[] | undefined,
      })
      .then((res) => {
        if (!cancelled) setData(res as T);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, opts.address, opts.functionName, argsKey, tick, opts.abi]);

  const refetch = useCallback(() => setTick((n) => n + 1), []);
  return { data, isLoading, isError, refetch };
}

type WriteArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  chainId?: number;
};

export function useWriteContract() {
  const { wallets } = useWallets();
  const [data, setData] = useState<Hex | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const writeContract = useCallback(
    async (args: WriteArgs) => {
      setError(null);
      setData(undefined);
      setIsPending(true);
      try {
        const wallet = wallets[0];
        if (!wallet) throw new Error('No wallet connected');
        if (Number(wallet.chainId?.split(':')[1]) !== ritualChain.id) {
          await wallet.switchChain(ritualChain.id);
        }
        const provider = await wallet.getEthereumProvider();
        const walletClient = createWalletClient({
          chain: ritualChain,
          transport: custom(provider),
          account: wallet.address as Address,
        });
        const hash = await walletClient.writeContract({
          address: args.address,
          abi: args.abi,
          functionName: args.functionName,
          args: args.args as readonly unknown[] | undefined,
          chain: ritualChain,
        });
        setData(hash);
        return hash;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [wallets],
  );

  return { writeContract, data, isPending, error };
}

export function useWaitForTransactionReceipt(opts: { hash?: Hex; chainId?: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const lastHash = useRef<Hex | undefined>(undefined);

  useEffect(() => {
    if (!opts.hash) {
      setIsLoading(false);
      setIsSuccess(false);
      lastHash.current = undefined;
      return;
    }
    if (lastHash.current === opts.hash) return;
    lastHash.current = opts.hash;
    let cancelled = false;
    setIsLoading(true);
    setIsSuccess(false);
    ritualClient
      .waitForTransactionReceipt({ hash: opts.hash })
      .then((receipt) => {
        if (!cancelled) setIsSuccess(receipt.status === 'success');
      })
      .catch(() => {
        if (!cancelled) setIsSuccess(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [opts.hash]);

  return { isLoading, isSuccess };
}
