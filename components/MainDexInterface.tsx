'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Navigation } from './layout/Navigation';
import { SwapInterface } from './SwapInterface';
import { TradingStats } from './TradingStats';
import { PoolInfo } from './PoolInfo';
import { TransactionHistory } from './TransactionHistory';
import { BondingCurve } from './bonding/BondingCurve';
import { LiquidityPools } from './liquidity/LiquidityPools';
import { YieldFarming } from './farming/YieldFarming';
import { Portfolio } from './portfolio/Portfolio';
import { Analytics } from './analytics/Analytics';
import { TokenCreator } from './token/TokenCreator';
import { AccountManager } from './auth/AccountManager';
import { ApiSettings } from './settings/ApiSettings';

export function MainDexInterface() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('trade');

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'trade':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SwapInterface onSwap={fetchBalance} />
              <TradingStats />
            </div>
            <div className="space-y-8">
              <PoolInfo />
              <TransactionHistory />
            </div>
          </div>
        );
      case 'bonding':
        return <BondingCurve />;
      case 'liquidity':
        return <LiquidityPools />;
      case 'farming':
        return <YieldFarming />;
      case 'portfolio':
        return <Portfolio />;
      case 'analytics':
        return <Analytics />;
      case 'create':
        return <TokenCreator />;
      case 'account':
        return <AccountManager />;
      case 'settings':
        return <ApiSettings />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SwapInterface onSwap={fetchBalance} />
              <TradingStats />
            </div>
            <div className="space-y-8">
              <PoolInfo />
              <TransactionHistory />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation 
        balance={balance} 
        loading={loading} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}