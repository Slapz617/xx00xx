'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export function TradingStats() {
  const stats = [
    {
      label: '24h Volume',
      value: '$1,234,567',
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
    },
    {
      label: 'Total Liquidity',
      value: '$45.2M',
      change: '+5.2%',
      positive: true,
      icon: Activity,
    },
    {
      label: 'Active Pairs',
      value: '156',
      change: '+8',
      positive: true,
      icon: TrendingUp,
    },
    {
      label: 'Avg. Fee',
      value: '0.25%',
      change: '-0.05%',
      positive: false,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="glass-morphism p-6 card-hover">
      <h2 className="text-xl font-semibold text-white mb-6">Trading Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-5 w-5 text-purple-400" />
              <span className={`text-sm font-medium ${
                stat.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}