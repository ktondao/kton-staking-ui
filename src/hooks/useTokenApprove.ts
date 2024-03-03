import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, erc20Abi, parseEther } from 'viem';

import { useWalletInteractionToast } from './useWalletInteractionToast';
import { useAppState } from './useAppState';

import type { ChainId } from '@/types/chains';

interface UseTokenApproveProps {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  activeChainId: ChainId;
}

export function useTokenApprove({
  tokenAddress,
  spenderAddress,
  activeChainId
}: UseTokenApproveProps) {
  const { updateOperationStatus } = useAppState();
  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data, reset } =
    useWriteContract();

  const approve = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      updateOperationStatus('approve', 1);
      return await writeContractAsync({
        chainId: activeChainId,
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'approve',
        args: [spenderAddress, parseEther(amount)]
      })?.catch((data) => {
        updateOperationStatus('approve', 0);
        return data;
      });
    },
    [tokenAddress, activeChainId, spenderAddress, writeContractAsync, updateOperationStatus]
  );

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    approve,
    approveReset: reset,
    isApproving: isPending,
    approveData: data,
    isApproveSuccess: isSuccess,
    isApproveError: isError,
    approveFailureReason: failureReason
  };
}
