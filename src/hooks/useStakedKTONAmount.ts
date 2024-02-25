'use client';

import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface UseStakedKTONAmountProps {
  ownerAddress: `0x${string}`;
}

export const useStakedKTONAmount = ({ ownerAddress }: UseStakedKTONAmountProps) => {
  const { activeChainId, activeChain } = useApp();

  const { data, isLoading, isError, isSuccess, refetch } = useReadContract({
    chainId: activeChainId,
    address: activeChain.stakingContractAddress,
    abi,
    functionName: 'balanceOf',
    args: [ownerAddress!]
  });

  const balance = useMemo(() => {
    if (isSuccess) {
      return data || 0n;
    }
    if (isError) {
      return 0n;
    }
    return 0n;
  }, [data, isSuccess, isError]);

  return {
    value: balance,
    formatted: formatEther(balance),
    isLoading,
    refetch
  };
};
