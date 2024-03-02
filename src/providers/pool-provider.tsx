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
  refetch: () => void;
  queryKey: QueryKey;
};

export const PoolContext = createContext<PoolProviderType>({
  value: undefined,
  formatted: '0',
  isLoading: false,
  refetch: () => {},
  queryKey: []
});

export const PoolProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { activeChain } = useChain();

  const { value, formatted, isLoading, refetch, queryKey } = useBigIntContractQuery({
    contractAddress: activeChain?.stakingContractAddress,
    abi,
    functionName: 'totalSupply',
    forceEnabled: true
  });

  return (
    <PoolContext.Provider
      value={{
        value,
        formatted,
        isLoading,
        queryKey,
        refetch
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};
