import type { Metadata } from 'next';
import { Web3AppProvider } from '@/providers/web3-app-provider';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ChainProvider } from '@/providers/chain-provider';
import { Toaster } from '@/components/ui/sonner';

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
      <body className={fontJetBrainsMono.className}>
        <Web3AppProvider>
          <ChainProvider>
            <div className="flex h-screen w-screen flex-col ">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" duration={5000} />
          </ChainProvider>
        </Web3AppProvider>
      </body>
    </html>
  );
}
