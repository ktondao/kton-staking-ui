'use client';

import React, { createContext, useCallback, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import { ChainConfig, ChainId } from '@/types/chains';
import { getChainById, getDefaultChain, getDefaultChainId } from '@/utils/chain';

interface ChainContextType {
  isSupportedChainId: boolean;
  activeChain: ChainConfig;
  activeChainId: ChainId;
  switchChain: (chainId: ChainId) => void;
}

export const ChainContext = createContext<ChainContextType>({
  isSupportedChainId: false,
  activeChain: getDefaultChain(),
  activeChainId: getDefaultChainId(),
  switchChain: () => {}
});

export const ChainProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { chainId } = useAccount();

  const { chains, switchChain } = useSwitchChain();

  const handleSwitchChain = useCallback(
    (selectedChainId: ChainId) => {
      switchChain({ chainId: selectedChainId });
    },
    [switchChain]
  );

  const activeChain = getChainById(chainId as ChainId) || getDefaultChain();
  const activeChainId = chainId || getDefaultChainId();

  useEffect(() => {
    if (activeChain?.name) {
      const currentClasses = document.body.classList;
      currentClasses.forEach((className) => {
        if (className.endsWith('-theme')) {
          document.body.classList.remove(className);
        }
      });
      document.body.classList.add(`${activeChain.name?.toLocaleLowerCase()}-theme`);
    }
  }, [activeChain?.name]);

  const isSupportedChainId = Boolean(chainId && chains?.some((chain) => chain.id === chainId));

  return (
    <ChainContext.Provider
      value={{
        activeChain,
        activeChainId,
        switchChain: handleSwitchChain,
        isSupportedChainId
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
