'use client';

import React, { createContext, useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'sonner';
import { ChainConfig, ChainId } from '@/types/chains';
import { getChainById, getDefaultChainConfig } from '@/utils/chain';
import { useDebounce } from 'react-use';

const CHAIN_ID_KEY = 'CHAIN_ID_KEY';
const defaultChainId = (localStorage.getItem(CHAIN_ID_KEY) ||
  getDefaultChainConfig()?.id) as ChainId;

interface ChainContextType {
  activeChainId: ChainId;
  setActiveChainId: (chainId: ChainId) => void;
  isCorrectChainId: boolean;
  isSupportedChainId: boolean;
  activeChain: ChainConfig;
  handleSwitchChain: (chainId: ChainId) => void;
}

export const ChainContext = createContext<ChainContextType>({
  activeChainId: defaultChainId,
  setActiveChainId: () => {},
  isCorrectChainId: false,
  isSupportedChainId: false,
  activeChain: getDefaultChainConfig(),
  handleSwitchChain: () => {}
});

export const ChainProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const toastRef = useRef<string | number | null>(null);
  const [activeChainId, setActiveChainId] = useState<ChainId>(Number(defaultChainId));

  const { chainId } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  const handleSwitchChain = useCallback(
    (selectedChainId: ChainId) => {
      if (chainId)
        if (selectedChainId === chainId) {
          setActiveChainId(selectedChainId);
          localStorage.setItem(CHAIN_ID_KEY, selectedChainId as unknown as string);
          return;
        }
      switchChain(
        { chainId: selectedChainId },
        {
          onSuccess: () => {
            setActiveChainId(selectedChainId);
            localStorage.setItem(CHAIN_ID_KEY, selectedChainId as unknown as string);
          }
        }
      );
    },
    [switchChain, chainId]
  );

  const activeChain = useMemo(
    () => getChainById(activeChainId) || getDefaultChainConfig(),
    [activeChainId]
  );

  useEffect(() => {
    if (activeChain?.primaryColor)
      document.documentElement.style.setProperty('--primary', activeChain.primaryColor);
  }, [activeChain?.primaryColor]);

  const isSupportedChainId = useMemo(
    () => Boolean(chainId && chains?.some((chain) => chain.id === chainId)),
    [chainId, chains]
  );

  const isCorrectChainId = !!chainId && chainId === activeChainId;

  useDebounce(
    () => {
      if (chainId && chainId !== activeChainId) {
        if (toastRef.current) {
          toast.dismiss(toastRef.current);
          toastRef.current = null;
        }
        toastRef.current = toast(
          <div className="space-x-1">
            <span>You are connected to the Wrong Chain.</span>
            <span
              className=" cursor-pointer text-primary hover:opacity-80"
              onClick={() => handleSwitchChain(activeChainId)}
            >
              Change the selected Chain to {activeChain?.name}
            </span>
            <span>in MetaMask.</span>
          </div>,
          {
            duration: 0,
            onAutoClose: () => {
              console.log('onAutoClose');
              toastRef.current = null;
            },
            onDismiss: () => {
              console.log('onDismiss');
              toastRef.current = null;
            }
          }
        );
      }
      if (!chainId || chainId === activeChainId) {
        if (toastRef.current) {
          toast.dismiss(toastRef.current);
          toastRef.current = null;
        }
      }
    },
    300,
    [chainId, activeChainId, activeChain.name, handleSwitchChain]
  );

  return (
    <ChainContext.Provider
      value={{
        activeChain,
        activeChainId,
        setActiveChainId,
        handleSwitchChain,
        isSupportedChainId,
        isCorrectChainId
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
