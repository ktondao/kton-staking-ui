'use client';

import { useMemo } from 'react';
import { Abi, ContractFunctionArgs, ContractFunctionName, formatEther } from 'viem';
import { useReadContract, Config, useAccount } from 'wagmi';

import { useChain } from './useChain';

interface UseBigIntContractQueryProps {
  abi: Abi;
  contractAddress: `0x${string}`;
  functionName: ContractFunctionName<Abi, 'pure' | 'view'>;
  args?: ContractFunctionArgs<Abi, 'pure' | 'view', ContractFunctionName<Abi, 'pure' | 'view'>>;
  forceEnabled?: boolean;
}

export const useBigIntContractQuery = ({
  contractAddress,
  abi,
  functionName,
  forceEnabled,
  args = []
}: UseBigIntContractQueryProps) => {
  const { isConnected } = useAccount();
  const { activeChainId } = useChain();

  const { data, refetch, isLoading, isSuccess, queryKey, isRefetching } = useReadContract<
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
    args,
    query: {
      enabled: forceEnabled ? true : isConnected
    }
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

  const isLoadingOrRefetching = useMemo(() => isLoading || isRefetching, [isLoading, isRefetching]);

  return {
    value: result.value,
    formatted: result.formatted,
    isLoading: isLoading,
    isRefetching,
    isLoadingOrRefetching,
    refetch,
    queryKey
  };
};
