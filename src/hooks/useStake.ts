import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useWalletInteractionToast } from './useWalletInteractionToast';
import { useApp } from './useApp';

interface UseStakeProps {
  ownerAddress: `0x${string}`;
}

export function useStake({ ownerAddress }: UseStakeProps) {
  const { activeChainId, activeChain } = useApp();

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const stake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'stake',
        args: [parseEther(amount)]
      });
    },
    [activeChain?.stakingContractAddress, activeChainId, ownerAddress, writeContractAsync]
  );

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    stake,
    isStaking: isPending,
    stakeData: data,
    isStakeSuccess: isSuccess,
    isStakeError: isError,
    skateFailureReason: failureReason
  };
}
