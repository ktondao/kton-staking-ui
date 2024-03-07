'use client';

import React, { createContext, useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

import { ChainId } from '@/types/chains';

export type OperationStatusType = 'stake' | 'unstake' | 'claim' | 'approve';

export type AppProviderType = {
  operationStatusMap: Record<string, number>;
  updateOperationStatus: (type: OperationStatusType, num: 1 | 0) => void;
};

export const AppContext = createContext<AppProviderType>({
  operationStatusMap: {},
  updateOperationStatus: () => {}
});

export const generateOperationKey = (
  address: `0x${string}`,
  chainId: ChainId,
  type: OperationStatusType
) => `${address}-${chainId}-${type}`;

export const getOperationStatus = (
  operationStatusMap: Record<string, number>,
  address: `0x${string}`,
  chainId: ChainId,
  type: OperationStatusType
): number => {
  const key = generateOperationKey(address, chainId, type);
  return operationStatusMap?.[key] || 0;
};

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { address, chainId } = useAccount();
  const [operationStatusMap, _updateOperationStatus] = useState<Record<string, number>>({});

  const updateOperationStatus = useCallback(
    (type: OperationStatusType, num: 1 | 0) => {
      if (address && chainId) {
        _updateOperationStatus((prev) => {
          const key = generateOperationKey(address, chainId, type);
          return {
            ...prev,
            [key]: num
          };
        });
      }
    },
    [address, chainId]
  );

  return (
    <AppContext.Provider
      value={{
        operationStatusMap,
        updateOperationStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
