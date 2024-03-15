'use client';

import * as React from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { APP_NAME } from '@/config/baseInfo';
import { getDefaultChain } from '@/utils/chain';

import '@rainbow-me/rainbowkit/styles.css';

export function Provider({ children }: React.PropsWithChildren<{}>) {
  const initialChain = getDefaultChain();
  return (
    <RainbowKitProvider
      locale="en-US"
      theme={darkTheme({
        borderRadius: 'medium',
        accentColor: 'hsl(var( --primary))'
      })}
      appInfo={{
        appName: APP_NAME
      }}
      initialChain={initialChain}
    >
      {children}
    </RainbowKitProvider>
  );
}
