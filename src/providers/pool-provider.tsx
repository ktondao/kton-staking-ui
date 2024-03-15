'use client';

import React, { createContext } from 'react';

import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useChain } from '@/hooks/useChain';
import { abi } from '@/config/abi/KTONStakingRewards';

import type { QueryKey } from '@tanstack/react-query';

export type PoolProviderType = {
  value: bigint | undefined;
  formatted: string;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
  queryKey: QueryKey;
};

export const PoolContext = createContext<PoolProviderType>({
  value: undefined,
  formatted: '0',
  isLoading: false,
  isRefetching: false,
  refetch: () => {},
  queryKey: []
});

export const PoolProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { activeChain, isSupportedChainId } = useChain();

  const { value, formatted, isLoading, isRefetching, refetch, queryKey } = useBigIntContractQuery({
    contractAddress: activeChain?.stakingContractAddress,
    abi,
    functionName: 'totalSupply',
    forceEnabled: isSupportedChainId
  });

  return (
    <PoolContext.Provider
      value={{
        value,
        formatted,
        isLoading,
        isRefetching,
        queryKey,
        refetch
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};
