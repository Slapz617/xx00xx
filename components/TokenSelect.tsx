'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TokenSelectProps {
  token: string;
  onSelect: (token: string) => void;
}

const TOKENS = [
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💰' },
  { symbol: 'USDT', name: 'Tether', icon: '₮' },
  { symbol: 'RAY', name: 'Raydium', icon: '🌟' },
  { symbol: 'SRM', name: 'Serum', icon: '🔥' },
  { symbol: 'MNGO', name: 'Mango', icon: '🥭' },
];

export function TokenSelect({ token, onSelect }: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedToken = TOKENS.find(t => t.symbol === token) || TOKENS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
      >
        <span className="text-lg">{selectedToken.icon}</span>
        <span className="text-white font-medium">{selectedToken.symbol}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-slate-800 rounded-lg border border-white/20 shadow-lg z-50 min-w-[200px]">
          {TOKENS.map((tokenOption) => (
            <button
              key={tokenOption.symbol}
              onClick={() => {
                onSelect(tokenOption.symbol);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <span className="text-lg">{tokenOption.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{tokenOption.symbol}</div>
                <div className="text-gray-400 text-sm">{tokenOption.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}