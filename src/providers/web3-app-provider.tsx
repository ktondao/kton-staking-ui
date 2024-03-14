'use client';

import * as React from 'react';
import { WagmiProvider, cookieStorage, createStorage } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  talismanWallet,
  okxWallet,
  imTokenWallet,
  trustWallet,
  safeWallet
} from '@rainbow-me/rainbowkit/wallets';

import { APP_NAME } from '@/config/baseInfo';
import { getChains } from '@/utils/chain';

import { Provider as RainbowKitProvider } from './rainbowkit-provider';

import '@rainbow-me/rainbowkit/styles.css';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: APP_NAME,
  projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'More',
      wallets: [talismanWallet, okxWallet, imTokenWallet, trustWallet, safeWallet]
    }
  ],
  chains: getChains(),
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
});

const queryClient = new QueryClient();

export function Web3AppProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
