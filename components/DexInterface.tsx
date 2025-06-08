'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Header } from './Header';
import { SwapInterface } from './SwapInterface';
import { TradingStats } from './TradingStats';
import { PoolInfo } from './PoolInfo';
import { TransactionHistory } from './TransactionHistory';

export function DexInterface() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      console.log("My address:", publicKey.toString());
    }
  }, [connected, publicKey, connection]);

  const fetchBalance = async () => {
    if (!publicKey) return;
    
    try {
      setLoading(true);
      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setBalance(balanceInSol);
      console.log(`My balance: ${balanceInSol} SOL`);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header balance={balance} loading={loading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2 space-y-8">
            <SwapInterface onSwap={fetchBalance} />
            <TradingStats />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <PoolInfo />
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  );
}