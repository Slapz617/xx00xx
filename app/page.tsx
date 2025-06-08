'use client';

import { WalletProvider } from '@/components/WalletProvider';
import { DexInterface } from '@/components/DexInterface';

export default function Home() {
  return (
    <WalletProvider>
      <DexInterface />
    </WalletProvider>
  );
}