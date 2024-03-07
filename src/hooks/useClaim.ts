import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType } from 'viem';

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

interface ClaimProps extends Pick<UseTransactionStatusProps, 'onError' | 'onSuccess'> {
  ownerAddress: `0x${string}`;
}

export function useClaim({ ownerAddress, onError, onSuccess }: ClaimProps) {
  const { activeChainId, activeChain } = useChain();
  const { operationStatusMap, updateOperationStatus } = useAppState();

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data, reset } =
    useWriteContract();

  const claim = useCallback(async (): Promise<WriteContractReturnType> => {
    updateOperationStatus('claim', 1);
    return await writeContractAsync({
      chainId: activeChainId,
      abi,
      address: activeChain.stakingContractAddress,
      account: ownerAddress!,
      functionName: 'getReward',
      args: []
    })?.catch((data) => {
      updateOperationStatus('claim', 0);
      return data;
    });
  }, [
    activeChain.stakingContractAddress,
    activeChainId,
    ownerAddress,
    writeContractAsync,
    updateOperationStatus
  ]);

  const { isLoading: isClaimTransactionConfirming } = useTransactionStatus({
    hash: data,
    onSuccess: (data) => {
      updateOperationStatus('claim', 0);
      if (data) {
        reset();
        onSuccessLatest?.(data);
      }
    },
    onError() {
      reset();
      updateOperationStatus('claim', 0);
      onErrorLatest?.();
    }
  });

  const isClaimAvailable =
    getOperationStatus(operationStatusMap, ownerAddress, activeChainId, 'claim') === 1;

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    claim,
    isClaiming: isClaimAvailable && isPending,
    claimData: data,
    isClaimSuccess: isSuccess,
    isClaimError: isError,
    claimFailureReason: failureReason,
    isClaimTransactionConfirming: isClaimAvailable && isClaimTransactionConfirming
  };
}
