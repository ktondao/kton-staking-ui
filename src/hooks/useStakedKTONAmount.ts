'use client';

import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface UseStakedKTONAmountProps {
  contractAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
}

export const useStakedKTONAmount = ({
  contractAddress,
  ownerAddress
}: UseStakedKTONAmountProps) => {
  const { activeChainId } = useApp();

  const { data, isLoading, isError, isSuccess } = useReadContract({
    chainId: activeChainId,
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: [ownerAddress]
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
    balance,
    etherBalance: formatEther(balance),
    isLoading
  };
};
