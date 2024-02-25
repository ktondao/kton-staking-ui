'use client';

import { useBigIntContractQuery } from './useBigIntContractQuery';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface UseRingRewardAmountProps {
  ownerAddress: `0x${string}`;
}

export const useRingRewardAmount = ({ ownerAddress }: UseRingRewardAmountProps) => {
  const { activeChain } = useApp();

  const { value, formatted, isLoading, refetch } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'earned',
    args: [ownerAddress]
  });

  return {
    value,
    formatted,
    isLoading,
    refetch
  };
};
