import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useApp } from './useApp';
import { useWalletInteractionToast } from './useWalletInteractionToast';

interface useClaimProps {
  ownerAddress: `0x${string}`;
}

export function useClaim({ ownerAddress }: useClaimProps) {
  const { activeChainId, activeChain } = useApp();
  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const claim = useCallback(async (): Promise<WriteContractReturnType> => {
    return await writeContractAsync({
      chainId: activeChainId,
      abi,
      address: activeChain.stakingContractAddress,
      account: ownerAddress!,
      functionName: 'getReward',
      args: []
    });
  }, [activeChain.stakingContractAddress, activeChainId, ownerAddress, writeContractAsync]);

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    claim,
    isClaiming: isPending,
    claimData: data,
    isClaimSuccess: isSuccess,
    isClaimError: isError,
    claimFailureReason: failureReason
  };
}
