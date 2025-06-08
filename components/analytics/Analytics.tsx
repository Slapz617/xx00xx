'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  Zap,
  Target,
  Database,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  ExternalLink
} from 'lucide-react';
import { MeteoraAnalytics } from './MeteoraAnalytics';

export function Analytics() {
  const [selectedView, setSelectedView] = useState('meteora');
  const [loading, setLoading] = useState(false);

  const views = [
    { id: 'meteora', label: 'Meteora Analytics', icon: Target },
    { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
    { id: 'trading', label: 'Trading Analytics', icon: TrendingUp },
    { id: 'liquidity', label: 'Liquidity Analytics', icon: Activity },
  ];

  const renderActiveView = () => {
    switch (selectedView) {
      case 'meteora':
        return <MeteoraAnalytics />;
      case 'overview':
        return <PlatformOverview />;
      case 'trading':
        return <TradingAnalytics />;
      case 'liquidity':
        return <LiquidityAnalytics />;
      default:
        return <MeteoraAnalytics />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Analytics Navigation */}
      <div className="glass-morphism p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Comprehensive analytics across all integrated protocols</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedView === view.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <view.icon className="h-4 w-4" />
                <span className="font-medium">{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active View Content */}
      {renderActiveView()}
    </div>
  );
}

// Platform Overview Component
function PlatformOverview() {
  const platformStats = [
    { label: 'Total Users', value: '12,456', change: '+8.2%', positive: true, icon: Users },
    { label: 'Total Volume', value: '$2.4M', change: '+15.3%', positive: true, icon: DollarSign },
    { label: 'Active Protocols', value: '5', change: '+1', positive: true, icon: Database },
    { label: 'Avg Transaction Fee', value: '0.25%', change: '-0.05%', positive: false, icon: TrendingDown },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <div key={index} className="glass-morphism p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-purple-400" />
              <span className={`text-sm font-medium ${
                stat.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Integrated Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Meteora', status: 'Connected', tvl: '$1.2M', icon: '🌊' },
            { name: 'Jupiter', status: 'Connected', tvl: '$850K', icon: '🪐' },
            { name: 'Raydium', status: 'Pending', tvl: '$0', icon: '⚡' },
            { name: 'Orca', status: 'Pending', tvl: '$0', icon: '🐋' },
            { name: 'Serum', status: 'Pending', tvl: '$0', icon: '🔥' },
            { name: 'Mango', status: 'Pending', tvl: '$0', icon: '🥭' },
          ].map((protocol, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{protocol.icon}</span>
                  <span className="text-white font-medium">{protocol.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  protocol.status === 'Connected' 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {protocol.status}
                </span>
              </div>
              <div className="text-gray-400 text-sm">TVL: {protocol.tvl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Trading Analytics Component
function TradingAnalytics() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Trading Analytics</h2>
      <div className="glass-morphism p-6">
        <p className="text-gray-400">Trading analytics coming soon...</p>
      </div>
    </div>
  );
}

// Liquidity Analytics Component
function LiquidityAnalytics() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Liquidity Analytics</h2>
      <div className="glass-morphism p-6">
        <p className="text-gray-400">Liquidity analytics coming soon...</p>
      </div>
    </div>
  );
}