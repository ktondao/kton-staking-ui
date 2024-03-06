'use client';

import { useMemo } from 'react';
import { Abi, ContractFunctionArgs, ContractFunctionName, formatEther } from 'viem';
import { useReadContract, Config, useAccount } from 'wagmi';

import { useChain } from './useChain';

interface UseBigIntContractQueryProps<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'pure' | 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'pure' | 'view', TFunctionName>
> {
  abi: TAbi;
  contractAddress: `0x${string}`;
  functionName: TFunctionName;
  args?: TArgs;
  forceEnabled?: boolean;
}

export const useBigIntContractQuery = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'pure' | 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'pure' | 'view', TFunctionName>
>({
  contractAddress,
  abi,
  functionName,
  forceEnabled,
  args = [] as TArgs
}: UseBigIntContractQueryProps<TAbi, TFunctionName, TArgs>) => {
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
    args: args as any[],
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
