'use client';

import { useBigIntContractQuery } from './useBigIntContractQuery';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface UseStakedKTONAmountProps {
  ownerAddress: `0x${string}`;
}

export const useStakedKTONAmount = ({ ownerAddress }: UseStakedKTONAmountProps) => {
  const { activeChain } = useApp();

  const { value, formatted, isLoading, refetch } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'balanceOf',
    args: [ownerAddress!]
  });

  return {
    value,
    formatted,
    isLoading,
    refetch
  };
};
