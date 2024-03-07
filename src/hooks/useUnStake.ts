import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useChain } from './useChain';
import { useWalletInteractionToast } from './useWalletInteractionToast';
import {
  ErrorType,
  SuccessType,
  UseTransactionStatusProps,
  useTransactionStatus
} from './useTransactionStatus';
import { useLatestCallback } from './useLatestCallback';
import { getOperationStatus, useAppState } from './useAppState';

interface UseUnStakeProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useUnStake({ ownerAddress, onError, onSuccess }: UseUnStakeProps) {
  const { activeChainId, activeChain } = useChain();
  const { operationStatusMap, updateOperationStatus } = useAppState();
  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data, reset } =
    useWriteContract();

  const unStake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      updateOperationStatus('unstake', 1);
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'withdraw',
        args: [parseEther(amount)]
      })?.catch((data) => {
        updateOperationStatus('unstake', 0);
        return data;
      });
    },
    [
      activeChain?.stakingContractAddress,
      activeChainId,
      ownerAddress,
      writeContractAsync,
      updateOperationStatus
    ]
  );
  const { isLoading: isUnstakeTransactionConfirming } = useTransactionStatus({
    hash: data,
    onSuccess: (data) => {
      updateOperationStatus('unstake', 0);
      if (data) {
        reset();
        onSuccessLatest?.(data);
      }
    },
    onError() {
      reset();
      updateOperationStatus('unstake', 0);
      onErrorLatest ?? (() => null);
    }
  });

  const isUnStakeAvailable =
    getOperationStatus(operationStatusMap, ownerAddress, activeChainId, 'unstake') === 1;

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    unStake,
    isUnStaking: isUnStakeAvailable && isPending,
    unStakeData: data,
    isUnStakeSuccess: isSuccess,
    isUnStakeError: isError,
    unStakeFailureReason: failureReason,
    isUnstakeTransactionConfirming: isUnStakeAvailable && isUnstakeTransactionConfirming
  };
}
