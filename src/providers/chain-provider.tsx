'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'sonner';
import { useDebounce } from 'react-use';

import { ChainConfig, ChainId } from '@/types/chains';
import {
  getChainById,
  getDefaultChain,
  getDefaultChainIdWithLocalStorage,
  getDefaultChainWithLocalStorage
} from '@/utils/chain';
import { CHAIN_ID_KEY } from '@/config/baseInfo';
import { setItem } from '@/utils/storage';

interface ChainContextType {
  activeChainId: ChainId;
  setActiveChainId: (chainId: ChainId) => void;
  isCorrectChainId: boolean;
  isSupportedChainId: boolean;
  activeChain: ChainConfig;
  switchChain: (chainId: ChainId) => void;
}

export const ChainContext = createContext<ChainContextType>({
  activeChainId: getDefaultChainIdWithLocalStorage(),
  setActiveChainId: () => {},
  isCorrectChainId: false,
  isSupportedChainId: false,
  activeChain: getDefaultChainWithLocalStorage(),
  switchChain: () => {}
});

export const ChainProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const toastRef = useRef<string | number | null>(null);
  const [activeChainId, setActiveChainId] = useState<ChainId>(getDefaultChainIdWithLocalStorage());

  const { chainId } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  const handleSetActiveChainId = useCallback(
    (chainId: ChainId) => {
      setActiveChainId(chainId);
      setItem(CHAIN_ID_KEY, chainId as unknown as string);
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }
    },
    [setActiveChainId]
  );

  const handleSwitchChain = useCallback(
    (selectedChainId: ChainId) => {
      if (chainId)
        if (selectedChainId === chainId) {
          handleSetActiveChainId(selectedChainId);
          return;
        }
      switchChain(
        { chainId: selectedChainId },
        {
          onSuccess: () => {
            handleSetActiveChainId(selectedChainId);
          }
        }
      );
    },
    [switchChain, chainId, handleSetActiveChainId]
  );

  const activeChain = getChainById(activeChainId) || getDefaultChain();

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
              toastRef.current = null;
            },
            onDismiss: () => {
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
        setActiveChainId: handleSetActiveChainId,
        switchChain: handleSwitchChain,
        isSupportedChainId,
        isCorrectChainId
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
