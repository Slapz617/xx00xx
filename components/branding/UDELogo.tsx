'use client';

import React from 'react';

interface UDELogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'full' | 'compact' | 'icon' | 'text';
  theme?: 'color' | 'monochrome' | 'dark' | 'light';
  className?: string;
  animated?: boolean;
}

export function UDELogo({ 
  size = 'md', 
  variant = 'full', 
  theme = 'color', 
  className = '',
  animated = false 
}: UDELogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16',
    lg: 'w-48 h-24',
    xl: 'w-64 h-32',
    xxl: 'w-80 h-40'
  };

  const getColors = () => {
    switch (theme) {
      case 'monochrome':
        return {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          accent: '#64748B',
          glow: '#FFFFFF',
          text: '#FFFFFF'
        };
      case 'dark':
        return {
          primary: '#1E293B',
          secondary: '#334155',
          accent: '#475569',
          glow: '#64748B',
          text: '#F1F5F9'
        };
      case 'light':
        return {
          primary: '#0F172A',
          secondary: '#1E293B',
          accent: '#334155',
          glow: '#6366F1',
          text: '#0F172A'
        };
      default: // color
        return {
          primary: '#6366F1', // Deep space blue
          secondary: '#8B5CF6', // Purple
          accent: '#06B6D4', // Teal
          glow: '#F59E0B', // Metallic gold
          text: '#F8FAFC'
        };
    }
  };

  const colors = getColors();

  if (variant === 'text') {
    return <UDETextLogo size={size} theme={theme} className={className} />;
  }

  if (variant === 'icon') {
    return <UDEIconLogo size={size} theme={theme} className={className} animated={animated} />;
  }

  if (variant === 'compact') {
    return <UDECompactLogo size={size} theme={theme} className={className} animated={animated} />;
  }

  // Full logo with UFO element
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 320 160"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
          
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.glow} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="ufoGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.4" />
          </radialGradient>

          {/* Filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background cosmic effect */}
        <g opacity="0.3">
          {/* Stars */}
          <circle cx="30" cy="30" r="1" fill={colors.glow} opacity="0.8">
            {animated && (
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="280" cy="45" r="1.5" fill={colors.accent} opacity="0.6">
            {animated && (
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="290" cy="120" r="1" fill={colors.secondary} opacity="0.7">
            {animated && (
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Connecting nodes */}
          <circle cx="60" cy="140" r="2" fill={colors.primary} opacity="0.4" />
          <circle cx="100" cy="135" r="1.5" fill={colors.accent} opacity="0.5" />
          <circle cx="220" cy="130" r="2" fill={colors.secondary} opacity="0.4" />
          <circle cx="260" cy="125" r="1.5" fill={colors.glow} opacity="0.6" />
          
          {/* Connection lines */}
          <line x1="60" y1="140" x2="100" y2="135" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />
          <line x1="100" y1="135" x2="220" y2="130" stroke={colors.accent} strokeWidth="0.5" opacity="0.3" />
          <line x1="220" y1="130" x2="260" y2="125" stroke={colors.secondary} strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* UFO Element */}
        <g transform="translate(160, 35)">
          {/* UFO beam */}
          <path 
            d="M -15 25 L -25 60 L 25 60 L 15 25 Z" 
            fill="url(#ufoGradient)" 
            opacity="0.4"
            filter="url(#softGlow)"
          >
            {animated && (
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.1;1"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </path>
          
          {/* UFO body */}
          <ellipse cx="0" cy="15" rx="20" ry="8" fill="url(#primaryGradient)" filter="url(#glow)" />
          <ellipse cx="0" cy="12" rx="15" ry="5" fill={colors.glow} opacity="0.6" />
          
          {/* UFO lights */}
          <circle cx="-10" cy="15" r="1.5" fill={colors.glow} opacity="0.8">
            {animated && (
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="0" cy="15" r="1.5" fill={colors.glow} opacity="0.8">
            {animated && (
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin="0.3s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="10" cy="15" r="1.5" fill={colors.glow} opacity="0.8">
            {animated && (
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin="0.6s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Hexagonal blockchain elements */}
        <g opacity="0.4">
          <polygon 
            points="50,100 40,110 40,130 50,140 60,130 60,110" 
            fill="none" 
            stroke={colors.primary} 
            strokeWidth="1.5"
          />
          <polygon 
            points="270,80 260,90 260,110 270,120 280,110 280,90" 
            fill="none" 
            stroke={colors.accent} 
            strokeWidth="1.5"
          />
        </g>

        {/* UDE Text */}
        <g transform="translate(160, 100)">
          {/* U */}
          <path 
            d="M -60 -10 L -60 10 Q -60 20 -50 20 L -40 20 Q -30 20 -30 10 L -30 -10"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          
          {/* D */}
          <path 
            d="M -15 -10 L -15 20 L -5 20 Q 10 20 10 5 L 10 5 Q 10 -10 -5 -10 L -15 -10"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          
          {/* E */}
          <g>
            <path 
              d="M 25 -10 L 25 20 M 25 -10 L 45 -10 M 25 5 L 40 5 M 25 20 L 45 20"
              fill="none"
              stroke="url(#primaryGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        </g>

        {/* Subtitle */}
        <text 
          x="160" 
          y="145" 
          textAnchor="middle" 
          fill={colors.text} 
          fontSize="8" 
          fontFamily="'Inter', sans-serif"
          opacity="0.8"
        >
          Unidentified Decentralized Exchange
        </text>
      </svg>
    </div>
  );
}

// Compact version for smaller spaces
export function UDECompactLogo({ 
  size = 'md', 
  theme = 'color', 
  className = '',
  animated = false 
}: Omit<UDELogoProps, 'variant'>) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-20 h-10',
    lg: 'w-24 h-12',
    xl: 'w-32 h-16',
    xxl: 'w-40 h-20'
  };

  const colors = theme === 'monochrome' 
    ? { primary: '#FFFFFF', accent: '#94A3B8', glow: '#FFFFFF' }
    : { primary: '#6366F1', accent: '#06B6D4', glow: '#F59E0B' };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg viewBox="0 0 120 60" className="w-full h-full">
        <defs>
          <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
          <filter id="compactGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Mini UFO */}
        <g transform="translate(15, 15)">
          <ellipse cx="0" cy="5" rx="8" ry="3" fill="url(#compactGradient)" filter="url(#compactGlow)" />
          <circle cx="0" cy="5" r="1" fill={colors.glow} opacity="0.8">
            {animated && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* UDE Text */}
        <text 
          x="40" 
          y="35" 
          fill="url(#compactGradient)" 
          fontSize="20" 
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          filter="url(#compactGlow)"
        >
          UDE
        </text>
      </svg>
    </div>
  );
}

// Icon-only version
export function UDEIconLogo({ 
  size = 'md', 
  theme = 'color', 
  className = '',
  animated = false 
}: Omit<UDELogoProps, 'variant'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    xxl: 'w-24 h-24'
  };

  const colors = theme === 'monochrome' 
    ? { primary: '#FFFFFF', secondary: '#94A3B8', accent: '#64748B', glow: '#FFFFFF' }
    : { primary: '#6366F1', secondary: '#8B5CF6', accent: '#06B6D4', glow: '#F59E0B' };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
          <radialGradient id="iconUfoGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.6" />
          </radialGradient>
          <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#iconGradient)" opacity="0.1" stroke="url(#iconGradient)" strokeWidth="1" />

        {/* UFO Element */}
        <g transform="translate(32, 20)">
          {/* UFO beam */}
          <path 
            d="M -8 12 L -12 28 L 12 28 L 8 12 Z" 
            fill="url(#iconUfoGradient)" 
            opacity="0.4"
          >
            {animated && (
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
            )}
          </path>
          
          {/* UFO body */}
          <ellipse cx="0" cy="8" rx="12" ry="4" fill="url(#iconGradient)" filter="url(#iconGlow)" />
          <ellipse cx="0" cy="6" rx="8" ry="2" fill={colors.glow} opacity="0.8" />
          
          {/* UFO lights */}
          <circle cx="-4" cy="8" r="1" fill={colors.glow}>
            {animated && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="0" cy="8" r="1" fill={colors.glow}>
            {animated && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.33s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="4" cy="8" r="1" fill={colors.glow}>
            {animated && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.66s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Hexagon elements */}
        <polygon points="10,45 6,50 6,56 10,61 14,56 14,50" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
        <polygon points="54,45 50,50 50,56 54,61 58,56 58,50" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.6" />

        {/* Connection nodes */}
        <circle cx="20" cy="52" r="1" fill={colors.secondary} opacity="0.7" />
        <circle cx="44" cy="52" r="1" fill={colors.accent} opacity="0.7" />
        <line x1="20" y1="52" x2="44" y2="52" stroke={colors.primary} strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
}

// Text-only version
export function UDETextLogo({ 
  size = 'md', 
  theme = 'color', 
  className = '' 
}: Omit<UDELogoProps, 'variant' | 'animated'>) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
    xxl: 'text-8xl'
  };

  const getTextColor = () => {
    switch (theme) {
      case 'monochrome':
        return 'text-white';
      case 'dark':
        return 'text-slate-800';
      case 'light':
        return 'text-slate-900';
      default:
        return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent';
    }
  };

  return (
    <div className={`${className} font-bold tracking-wider ${sizeClasses[size]} ${getTextColor()}`}>
      UDE
    </div>
  );
}

// Full brand logo with company name
export function UDEBrandLogo({ 
  size = 'lg', 
  theme = 'color', 
  className = '',
  animated = false 
}: UDELogoProps) {
  const sizeClasses = {
    sm: 'w-48 h-16',
    md: 'w-64 h-20',
    lg: 'w-80 h-24',
    xl: 'w-96 h-32',
    xxl: 'w-[480px] h-40'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center space-x-4`}>
      <UDEIconLogo size={size} theme={theme} animated={animated} />
      <div className="flex flex-col justify-center">
        <UDETextLogo size={size} theme={theme} />
        <div className={`text-xs opacity-60 ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Unidentified Decentralized Exchange
        </div>
      </div>
    </div>
  );
}

// Showcase component for different variations
export function UDELogoShowcase() {
  return (
    <div className="space-y-12 p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">UDE Logo System</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A comprehensive branding system for the Unidentified Decentralized Exchange, 
          featuring cosmic mystery and cutting-edge blockchain technology.
        </p>
      </div>

      {/* Full Logo Variations */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Full Logo Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-morphism p-8 text-center">
            <h3 className="text-white font-medium mb-4">Color Theme</h3>
            <UDELogo variant="full" theme="color" size="lg" animated />
          </div>
          <div className="glass-morphism p-8 text-center">
            <h3 className="text-white font-medium mb-4">Monochrome Theme</h3>
            <UDELogo variant="full" theme="monochrome" size="lg" />
          </div>
        </div>
      </section>

      {/* Compact Variations */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Compact Variations</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Large</h3>
            <UDECompactLogo size="lg" animated />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Medium</h3>
            <UDECompactLogo size="md" animated />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Small</h3>
            <UDECompactLogo size="sm" animated />
          </div>
        </div>
      </section>

      {/* Icon Variations */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Icon Variations</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">XL Icon</h3>
            <UDEIconLogo size="xl" animated />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Large Icon</h3>
            <UDEIconLogo size="lg" animated />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Medium Icon</h3>
            <UDEIconLogo size="md" animated />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Small Icon</h3>
            <UDEIconLogo size="sm" animated />
          </div>
        </div>
      </section>

      {/* Text Variations */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Text Variations</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Large Text</h3>
            <UDETextLogo size="xl" />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Medium Text</h3>
            <UDETextLogo size="lg" />
          </div>
          <div className="glass-morphism p-6 text-center">
            <h3 className="text-white font-medium mb-4">Small Text</h3>
            <UDETextLogo size="md" />
          </div>
        </div>
      </section>

      {/* Brand Logo */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Brand Logo</h2>
        <div className="glass-morphism p-8 text-center">
          <UDEBrandLogo size="lg" animated />
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-morphism p-6">
            <h3 className="text-white font-medium mb-4">Navigation Header</h3>
            <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
              <UDECompactLogo size="md" />
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white">Trade</button>
                <button className="text-gray-300 hover:text-white">Pools</button>
              </div>
            </div>
          </div>
          
          <div className="glass-morphism p-6">
            <h3 className="text-white font-medium mb-4">App Icon</h3>
            <div className="bg-slate-800 p-8 rounded-lg text-center">
              <UDEIconLogo size="xl" animated />
            </div>
          </div>
          
          <div className="glass-morphism p-6">
            <h3 className="text-white font-medium mb-4">Footer Brand</h3>
            <div className="bg-slate-800 p-4 rounded-lg">
              <UDEBrandLogo size="md" />
              <p className="text-gray-400 text-sm mt-2">
                The future of decentralized trading awaits discovery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}