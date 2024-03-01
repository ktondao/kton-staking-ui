'use client';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useBigIntContractQuery } from './useBigIntContractQuery';
import { useChain } from './useChain';

interface UseRingRewardAmountProps {
  ownerAddress: `0x${string}`;
}

export const useRingRewardAmount = ({ ownerAddress }: UseRingRewardAmountProps) => {
  const { activeChain } = useChain();

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
