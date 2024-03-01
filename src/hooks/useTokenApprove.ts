import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';

import { useApp } from './useApp';
import { useWalletInteractionToast } from './useWalletInteractionToast';

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
  const { writeContract, isPending, isError, isSuccess, failureReason, data } = useWriteContract();

  const approve = useCallback(
    (amount: string): void => {
      writeContract({
        chainId: activeChainId,
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'approve',
        args: [spenderAddress, parseEther(amount)]
      });
    },
    [tokenAddress, activeChainId, spenderAddress, writeContract]
  );

  useWalletInteractionToast({
    isError,
    isSuccess,
    failureReason
  });

  return {
    approve,
    isApproving: isPending,
    approveData: data,
    isApproveSuccess: isSuccess,
    isApproveError: isError,
    approveFailureReason: failureReason
  };
}
