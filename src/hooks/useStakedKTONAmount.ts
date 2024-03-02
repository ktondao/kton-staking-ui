'use client';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useBigIntContractQuery } from './useBigIntContractQuery';
import { useChain } from './useChain';

interface UseStakedKTONAmountProps {
  ownerAddress: `0x${string}`;
}

export const useStakedKTONAmount = ({ ownerAddress }: UseStakedKTONAmountProps) => {
  const { activeChain } = useChain();

  const { value, formatted, isLoading, refetch, queryKey } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'balanceOf',
    args: [ownerAddress!]
  });

  return {
    value,
    formatted,
    isLoading,
    refetch,
    queryKey
  };
};
