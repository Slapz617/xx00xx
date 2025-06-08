'use client';

import React from 'react';
import { Droplets, Plus } from 'lucide-react';

export function PoolInfo() {
  const pools = [
    {
      pair: 'SOL/USDC',
      tvl: '$2.4M',
      apr: '12.5%',
      volume24h: '$456K',
    },
    {
      pair: 'RAY/SOL',
      tvl: '$1.8M',
      apr: '18.3%',
      volume24h: '$234K',
    },
    {
      pair: 'USDC/USDT',
      tvl: '$3.2M',
      apr: '8.7%',
      volume24h: '$789K',
    },
  ];

  return (
    <div className="glass-morphism p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Top Pools</h2>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span className="text-sm">Add Liquidity</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {pools.map((pool, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">{pool.pair}</span>
              </div>
              <span className="text-green-400 font-medium">{pool.apr}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">TVL</div>
                <div className="text-white font-medium">{pool.tvl}</div>
              </div>
              <div>
                <div className="text-gray-400">24h Volume</div>
                <div className="text-white font-medium">{pool.volume24h}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}