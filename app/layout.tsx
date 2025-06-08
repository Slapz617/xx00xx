import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WalletProvider } from '@/components/wallet/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolSwap DEX - Decentralized Exchange on Solana',
  description: 'Trade tokens on Solana with the fastest and most efficient DEX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}