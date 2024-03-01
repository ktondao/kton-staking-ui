import { JetBrains_Mono } from 'next/font/google';

import { Web3AppProvider } from '@/providers/web3-app-provider';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ChainProvider } from '@/providers/chain-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/providers/app-provider';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KTON Staking Dashboard',
  description: 'KTON Staking Dashboard is the easiest way to stake KTON and get rewards.'
};
const fontJetBrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <body className={fontJetBrainsMono.className}>
        <Web3AppProvider>
          <ChainProvider>
            <AppProvider>
              <div className="flex h-dvh w-screen flex-col overflow-hidden lg:h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" duration={5000} />
            </AppProvider>
          </ChainProvider>
        </Web3AppProvider>
      </body>
    </html>
  );
}
