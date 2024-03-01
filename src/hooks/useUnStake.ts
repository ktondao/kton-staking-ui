import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

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

interface UseUnStakeProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useUnStake({ ownerAddress, onError, onSuccess }: UseUnStakeProps) {
  const { activeChainId, activeChain } = useApp();
  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

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
  const { isLoading: isUnstakeTransactionConfirming } = useTransactionStatus({
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
    unStake,
    isUnStaking: isPending,
    unStakeData: data,
    isUnStakeSuccess: isSuccess,
    isUnStakeError: isError,
    unStakeFailureReason: failureReason,
    isUnstakeTransactionConfirming
  };
}
