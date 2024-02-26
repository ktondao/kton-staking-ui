'use client';

import React, { createContext } from 'react';

import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useApp } from '@/hooks/useApp';
import { abi } from '@/config/abi/KTONStakingRewards';

export type PoolProviderType = {
  value: bigint | undefined;
  formatted: string;
  isLoading: boolean;
  refetch: () => void;
};

export const PoolContext = createContext<PoolProviderType>({
  value: undefined,
  formatted: '0',
  isLoading: false,
  refetch: () => {}
});

export const PoolProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { activeChain } = useApp();

  const { value, formatted, isLoading, refetch } = useBigIntContractQuery({
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
        refetch
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};
