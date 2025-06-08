'use client';

import React from 'react';
import { Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function TransactionHistory() {
  const transactions = [
    {
      type: 'swap',
      from: 'SOL',
      to: 'USDC',
      amount: '2.5',
      value: '$58.75',
      time: '2m ago',
      status: 'success',
    },
    {
      type: 'swap',
      from: 'USDC',
      to: 'RAY',
      amount: '100',
      value: '$100.00',
      time: '15m ago',
      status: 'success',
    },
    {
      type: 'liquidity',
      from: 'SOL',
      to: 'USDC',
      amount: '5.0',
      value: '$117.50',
      time: '1h ago',
      status: 'pending',
    },
    {
      type: 'swap',
      from: 'RAY',
      to: 'SOL',
      amount: '45.2',
      value: '$89.32',
      time: '2h ago',
      status: 'success',
    },
  ];

  return (
    <div className="glass-morphism p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {tx.type === 'swap' ? (
                  <ArrowUpRight className="h-4 w-4 text-blue-400" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-green-400" />
                )}
                <span className="text-white text-sm font-medium">
                  {tx.type === 'swap' ? 'Swap' : 'Add Liquidity'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'success' 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {tx.status}
                </span>
              </div>
              <span className="text-gray-400 text-xs">{tx.time}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">
                {tx.amount} {tx.from} → {tx.to}
              </span>
              <span className="text-white text-sm font-medium">{tx.value}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
        View All Transactions
      </button>
    </div>
  );
}