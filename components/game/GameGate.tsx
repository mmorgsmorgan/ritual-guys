'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { RITUAL_GUYS_ADDRESS, RITUAL_GUYS_ABI, ritualChain } from '@/lib/wallet/ritual';

const PENDING_START_KEY = 'ritual-guys-pending-start';

export function GameGate({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [gameStarted, setGameStarted] = useState(false);
  const [pendingFromStorage, setPendingFromStorage] = useState(false);

  const { data: isRegistered, isLoading: checkingReg } = useReadContract({
    address: RITUAL_GUYS_ADDRESS,
    abi: RITUAL_GUYS_ABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    chainId: ritualChain.id,
    query: { enabled: isConnected && !!address },
  });

  const { data: playerData, refetch: refetchPlayer } = useReadContract({
    address: RITUAL_GUYS_ADDRESS,
    abi: RITUAL_GUYS_ABI,
    functionName: 'players',
    args: address ? [address] : undefined,
    chainId: ritualChain.id,
    query: { enabled: isConnected && !!address },
  });

  const gamesPlayed = playerData ? Number(playerData[1]) : 0;

  // On mount, detect pending startGame from sessionStorage
  useEffect(() => {
    if (!isConnected || !address) return;
    try {
      const stored = sessionStorage.getItem(PENDING_START_KEY);
      if (!stored) return;
      const { addr } = JSON.parse(stored);
      if (addr !== address) {
        sessionStorage.removeItem(PENDING_START_KEY);
        return;
      }
      setPendingFromStorage(true);
    } catch {
      sessionStorage.removeItem(PENDING_START_KEY);
    }
  }, [isConnected, address]);

  // Poll the contract while we have a pending start from storage
  useEffect(() => {
    if (!pendingFromStorage || !playerData) return;
    try {
      const stored = sessionStorage.getItem(PENDING_START_KEY);
      if (!stored) { setPendingFromStorage(false); return; }
      const { baseline } = JSON.parse(stored);
      if (gamesPlayed > baseline) {
        sessionStorage.removeItem(PENDING_START_KEY);
        setPendingFromStorage(false);
        setGameStarted(true);
        return;
      }
    } catch {
      sessionStorage.removeItem(PENDING_START_KEY);
      setPendingFromStorage(false);
      return;
    }

    const interval = setInterval(() => {
      refetchPlayer();
    }, 3000);
    return () => clearInterval(interval);
  }, [pendingFromStorage, playerData, gamesPlayed, refetchPlayer]);

  const { writeContract: writeRegister, data: regTxHash, isPending: regSigning } = useWriteContract();
  const { isLoading: regConfirming, isSuccess: regConfirmed } = useWaitForTransactionReceipt({
    hash: regTxHash,
    chainId: ritualChain.id,
  });

  const { writeContract: writeStart, data: startTxHash, isPending: startSigning } = useWriteContract();
  const { isLoading: startConfirming, isSuccess: startConfirmed } = useWaitForTransactionReceipt({
    hash: startTxHash,
    chainId: ritualChain.id,
  });

  const registered = isRegistered || regConfirmed;

  if (isConnected && registered && (gameStarted || startConfirmed)) {
    if (!gameStarted && startConfirmed) {
      sessionStorage.removeItem(PENDING_START_KEY);
      setPendingFromStorage(false);
      setGameStarted(true);
    }
    return <>{children}</>;
  }

  const handleRegister = () => {
    writeRegister({
      address: RITUAL_GUYS_ADDRESS,
      abi: RITUAL_GUYS_ABI,
      functionName: 'registerPlayer',
      chainId: ritualChain.id,
    });
  };

  const handleStartGame = () => {
    sessionStorage.setItem(PENDING_START_KEY, JSON.stringify({
      addr: address,
      baseline: gamesPlayed,
    }));
    setPendingFromStorage(true);
    writeStart({
      address: RITUAL_GUYS_ADDRESS,
      abi: RITUAL_GUYS_ABI,
      functionName: 'startGame',
      chainId: ritualChain.id,
    });
  };

  const isBusy = regSigning || regConfirming || startSigning || startConfirming || pendingFromStorage;

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden flex items-center justify-center"
      style={{
        background: '#0D0520',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.15), 0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/bg-character.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 text-center px-6">
        <div className="font-display text-4xl text-candy-yellow text-outline mb-2">
          RITUAL GUYS
        </div>
        <p className="text-sm font-body text-white/50 mb-8">
          {!isConnected
            ? 'Connect your wallet to play'
            : !registered
              ? 'Register to start playing'
              : 'Sign contract to play'}
        </p>

        {!isConnected ? (
          <button
            onClick={openConnectModal}
            className="w-full py-4 rounded-full font-display text-xl text-white"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 6px 20px rgba(168,85,247,0.4)',
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            CONNECT WALLET
          </button>
        ) : checkingReg || isBusy ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/50 font-body text-sm">
              {checkingReg ? 'Checking registration...'
                : regSigning || startSigning ? 'Confirm in wallet...'
                : 'Waiting for confirmation...'}
            </p>
          </div>
        ) : !registered ? (
          <button
            onClick={handleRegister}
            className="w-full py-4 rounded-full font-display text-xl text-white"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 6px 20px rgba(168,85,247,0.4)',
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            REGISTER
          </button>
        ) : (
          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-full font-display text-xl text-white"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 6px 20px rgba(16,185,129,0.4)',
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            START GAME
          </button>
        )}
      </div>
    </div>
  );
}
