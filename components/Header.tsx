'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, TrendingUp, Loader2 } from 'lucide-react';

interface HeaderProps {
  balance: number;
  loading: boolean;
}

export function Header({ balance, loading }: HeaderProps) {
  const { connected } = useWallet();

  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">SolDEX</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Trade</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pools</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Analytics</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {connected && (
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Wallet className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `${balance.toFixed(4)} SOL`
                  )}
                </span>
              </div>
            )}
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}