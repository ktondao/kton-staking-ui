import { useCallback, useEffect, useRef } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { toast } from 'sonner';

import { useApp } from './useApp';

interface UseTokenAllowanceAndApproveProps {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
}

export function useTokenAllowanceAndApprove({
  tokenAddress,
  ownerAddress,
  spenderAddress
}: UseTokenAllowanceAndApproveProps) {
  const toastRef = useRef<string | number | null>(null);
  const { isConnected } = useAccount();
  const { activeChainId } = useApp();

  const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
    chainId: activeChainId,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
    query: {
      enabled: isConnected
    }
  });

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

  useEffect(() => {
    if (isError) {
      toastRef.current = toast(failureReason?.message || 'Approve failed', {
        duration: 5000,
        classNames: {
          toast: 'group-[.toaster]:border-red-500',
          closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
        }
      });
    }
    if (isSuccess) {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    }
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isError, isSuccess, failureReason]);

  return {
    isAllowanceLoading,
    allowance,
    approve,
    isApproving: isPending,
    approveData: data,
    isApproveSuccess: isSuccess,
    isApproveError: isError,
    approveFailureReason: failureReason
  };
}
