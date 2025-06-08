'use client';

import React from 'react';

interface FaiconLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'mono' | 'gradient';
  className?: string;
}

export function FaiconLogo({ size = 'md', variant = 'default', className = '' }: FaiconLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          x: 'fill-white',
          zero: 'fill-gray-300',
          bg: 'fill-gray-800'
        };
      case 'gradient':
        return {
          x: 'fill-purple-400',
          zero: 'fill-blue-400',
          bg: 'fill-transparent'
        };
      default:
        return {
          x: 'fill-purple-500',
          zero: 'fill-blue-500',
          bg: 'fill-slate-900'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          className={colors.bg}
          stroke="currentColor"
          strokeWidth="2"
        />
        
        {/* Left X */}
        <g className={colors.x}>
          <path d="M15 25 L30 40 M30 25 L15 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* First 0 */}
        <circle
          cx="37"
          cy="50"
          r="8"
          className={colors.zero}
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
        />
        
        {/* Second 0 */}
        <circle
          cx="63"
          cy="50"
          r="8"
          className={colors.zero}
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
        />
        
        {/* Right X */}
        <g className={colors.x}>
          <path d="M70 25 L85 40 M85 25 L70 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* Connecting lines for tech effect */}
        <line x1="30" y1="32" x2="29" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="70" y1="32" x2="71" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

// Text logo variant
export function FaiconTextLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <FaiconLogo size="md" variant="gradient" />
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        faicon
      </span>
    </div>
  );
}

// CSS-based alternative logo
export function FaiconCSSLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`${sizeClasses[size]} font-mono font-bold ${className}`}>
      <span className="text-purple-400">x</span>
      <span className="text-blue-400">00</span>
      <span className="text-purple-400">x</span>
    </div>
  );
}