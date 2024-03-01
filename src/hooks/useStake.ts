import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useWalletInteractionToast } from './useWalletInteractionToast';
import { useApp } from './useApp';
import {
  UseTransactionStatusProps,
  SuccessType,
  ErrorType,
  useTransactionStatus
} from './useTransactionStatus';
import { useLatestCallback } from './useLatestCallback';

interface UseStakeProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useStake({ ownerAddress, onSuccess, onError }: UseStakeProps) {
  const { activeChainId, activeChain } = useApp();

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

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

  const { isLoading: isStakeTransactionConfirming } = useTransactionStatus({
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
    stake,
    isStaking: isPending,
    stakeData: data,
    isStakeSuccess: isSuccess,
    isStakeError: isError,
    skateFailureReason: failureReason,
    isStakeTransactionConfirming
  };
}
