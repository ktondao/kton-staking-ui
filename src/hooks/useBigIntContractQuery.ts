'use client';

import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract, Config } from 'wagmi';
import { useApp } from './useApp';

interface UseBigIntContractQueryProps {
  abi: any;
  contractAddress: `0x${string}`;
  functionName: string;
  args?: any[];
}

export const useBigIntContractQuery = ({
  contractAddress,
  abi,
  functionName,
  args = []
}: UseBigIntContractQueryProps) => {
  const { activeChainId } = useApp();
  const { data, refetch, isLoading, isSuccess } = useReadContract<
    any,
    string,
    any[],
    Config,
    bigint | undefined
  >({
    chainId: activeChainId,
    address: contractAddress,
    abi,
    functionName,
    args
  });

  const result = useMemo(() => {
    if (isSuccess && data) {
      return {
        value: data,
        formatted: formatEther(data)
      };
    }
    return {
      value: 0n,
      formatted: '0'
    };
  }, [data, isSuccess]);

  return {
    value: result.value,
    formatted: result.formatted,
    isLoading,
    refetch
  };
};
