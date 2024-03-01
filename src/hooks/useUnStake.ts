import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useApp } from './useApp';
import { useWalletInteractionToast } from './useWalletInteractionToast';

interface UseUnStakeProps {
  ownerAddress: `0x${string}`;
}

export function useUnStake({ ownerAddress }: UseUnStakeProps) {
  const { activeChainId, activeChain } = useApp();

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const unStake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'withdraw',
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
    unStake,
    isUnStaking: isPending,
    unStakeData: data,
    isUnStakeSuccess: isSuccess,
    isUnStakeError: isError,
    unStakeFailureReason: failureReason
  };
}
