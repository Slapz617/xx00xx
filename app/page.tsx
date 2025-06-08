'use client';

import { WalletProvider } from '@/components/WalletProvider';
import { MainDexInterface } from '@/components/MainDexInterface';

export default function Home() {
  return (
    <WalletProvider>
      <MainDexInterface />
    </WalletProvider>
  );
}