'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  TrendingUp, 
  Wallet, 
  Loader2, 
  BarChart3, 
  Droplets, 
  Coins, 
  Sprout, 
  PieChart, 
  Activity,
  Zap
} from 'lucide-react';

interface NavigationProps {
  balance: number;
  loading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ balance, loading, activeTab, onTabChange }: NavigationProps) {
  const { connected } = useWallet();

  const tabs = [
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'bonding', label: 'Bonding Curves', icon: BarChart3 },
    { id: 'liquidity', label: 'Liquidity', icon: Droplets },
    { id: 'farming', label: 'Farming', icon: Sprout },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'create', label: 'Create Token', icon: Coins },
  ];

  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SolSwap DEX
              </h1>
            </div>
            
            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
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
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg !transition-all !duration-200 !shadow-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}