import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useTokenAllowance } from './useTokenAllowance';
import { useTokenApprove } from './useTokenApprove';
import { useTransactionStatus } from './useTransactionStatus';
import { useChain } from './useChain';
import { getOperationStatus, useAppState } from './useAppState';

interface UseTokenAllowanceAndApproveProps {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: bigint;
}
export const useTokenAllowanceAndApprove = ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  amount
}: UseTokenAllowanceAndApproveProps) => {
  const queryClient = useQueryClient();

  const { isConnected } = useAccount();
  const { activeChainId } = useChain();
  const { operationStatusMap, updateOperationStatus } = useAppState();

  const { isAllowanceLoading, allowance, refetchAllowance, allowanceQueryKey } = useTokenAllowance({
    tokenAddress,
    ownerAddress,
    spenderAddress,
    isConnected,
    activeChainId
  });

  const { approve, isApproving, approveData } = useTokenApprove({
    tokenAddress,
    spenderAddress,
    activeChainId
  });

  const { isLoading: isApproveTransactionConfirming } = useTransactionStatus({
    hash: approveData,
    onSuccess: () => {
      updateOperationStatus('approve', 0);
      if (approveData) {
        refetchAllowance();
        queryClient.setQueryData(allowanceQueryKey, () => {
          return amount || 0n;
        });
      }
    },
    onError: () => {
      updateOperationStatus('approve', 0);
    }
  });
  const needApprove = useMemo(() => !allowance || allowance < amount, [allowance, amount]);

  const isApproveAvailable = useMemo(() => {
    return getOperationStatus(operationStatusMap, ownerAddress, activeChainId, 'approve') === 1;
  }, [operationStatusMap, ownerAddress, activeChainId]);

  return {
    allowance,
    refetchAllowance,
    allowanceQueryKey,
    isAllowanceLoading,
    approve,
    isApproving: isApproveAvailable && isApproving,
    isApproveTransactionConfirming: isApproveAvailable && isApproveTransactionConfirming,
    needApprove
  };
};
