import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useWalletInteractionToast } from './useWalletInteractionToast';
import { useChain } from './useChain';
import {
  UseTransactionStatusProps,
  SuccessType,
  ErrorType,
  useTransactionStatus
} from './useTransactionStatus';
import { useLatestCallback } from './useLatestCallback';
import { useAppState, getOperationStatus } from './useAppState';

interface UseStakeProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useStake({ ownerAddress, onSuccess, onError }: UseStakeProps) {
  const { activeChainId, activeChain } = useChain();
  const { operationStatusMap, updateOperationStatus } = useAppState();

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data, reset } =
    useWriteContract({});

  const stake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      updateOperationStatus('stake', 1);
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'stake',
        args: [parseEther(amount)]
      })?.catch((data) => {
        updateOperationStatus('stake', 0);
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

  const { isLoading: isStakeTransactionConfirming } = useTransactionStatus({
    hash: data,
    onSuccess: (data) => {
      updateOperationStatus('stake', 0);
      if (data) {
        reset();
        onSuccessLatest?.(data);
      }
    },
    onError: () => {
      reset();
      updateOperationStatus('stake', 0);
      onErrorLatest ?? (() => null);
    }
  });

  const isStakeAvailable =
    getOperationStatus(operationStatusMap, ownerAddress, activeChainId, 'stake') === 1;

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    stake,
    isStaking: isStakeAvailable && isPending,
    stakeTransactionData: data,
    isStakeSuccess: isSuccess,
    isStakeError: isError,
    stateFailureReason: failureReason,
    isStakeTransactionConfirming: isStakeAvailable && isStakeTransactionConfirming
  };
}
