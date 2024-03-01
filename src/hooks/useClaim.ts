import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useApp } from './useApp';
import { useWalletInteractionToast } from './useWalletInteractionToast';
import {
  ErrorType,
  SuccessType,
  UseTransactionStatusProps,
  useTransactionStatus
} from './useTransactionStatus';
import { useLatestCallback } from './useLatestCallback';

interface useClaimProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useClaim({ ownerAddress, onError, onSuccess }: useClaimProps) {
  const { activeChainId, activeChain } = useApp();

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

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

  const { isLoading: isClaimTransactionConfirming } = useTransactionStatus({
    hash: data,
    onSuccess: (data) => {
      if (data) {
        onSuccessLatest?.(data);
      }
    },
    onError: onErrorLatest ?? (() => null)
  });

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
    claimFailureReason: failureReason,
    isClaimTransactionConfirming
  };
}
