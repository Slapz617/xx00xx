'use client';

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ArrowDownUp, Settings, Info } from 'lucide-react';
import { TokenSelect } from './TokenSelect';

interface SwapInterfaceProps {
  onSwap: () => void;
}

export function SwapInterface({ onSwap }: SwapInterfaceProps) {
  const { connected } = useWallet();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [slippage, setSlippage] = useState(0.5);

  const handleSwap = async () => {
    if (!connected) return;
    
    // Simulate swap transaction
    console.log('Executing swap:', {
      from: fromToken,
      to: toToken,
      amount: fromAmount,
      slippage
    });
    
    // After successful swap, refresh balance
    onSwap();
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="glass-morphism p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Swap</h2>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Settings className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* From Token */}
        <div className="token-input rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-sm text-gray-400">Balance: 12.34</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            />
            <TokenSelect
              token={fromToken}
              onSelect={setFromToken}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapTokens}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowDownUp className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* To Token */}
        <div className="token-input rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">To</span>
            <span className="text-sm text-gray-400">Balance: 0.00</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="0.0"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            />
            <TokenSelect
              token={toToken}
              onSelect={setToToken}
            />
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && (
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">1 SOL = 23.45 USDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Slippage</span>
              <span className="text-white">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-white">~0.00025 SOL</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!connected || !fromAmount}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors"
        >
          {!connected ? 'Connect Wallet' : 'Swap'}
        </button>
      </div>
    </div>
  );
}