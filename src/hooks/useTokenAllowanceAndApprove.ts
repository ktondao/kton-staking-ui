import { erc20Abi } from 'viem';

import { useTokenApprove } from './useTokenApprove';
import { ErrorType, SuccessType, useTransactionStatus } from './useTransactionStatus';
import { useChain } from './useChain';
import { getOperationStatus, useAppState } from './useAppState';
import { useLatestCallback } from './useLatestCallback';
import { useBigIntContractQuery } from './useBigIntContractQuery';

interface UseTokenAllowanceAndApproveProps {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: bigint;
  onSuccess?: SuccessType;
  onError?: ErrorType;
}
export const useTokenAllowanceAndApprove = ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  amount,
  onSuccess,
  onError
}: UseTokenAllowanceAndApproveProps) => {
  const { activeChainId } = useChain();
  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);
  const { operationStatusMap, updateOperationStatus } = useAppState();

  const {
    value: allowance,
    isLoading: isAllowanceLoading,
    isRefetching: isAllowanceRefetching,
    refetch: refetchAllowance,
    queryKey: allowanceQueryKey
  } = useBigIntContractQuery({
    contractAddress: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress]
  });

  const { approve, isApproving, approveData, approveReset } = useTokenApprove({
    tokenAddress,
    spenderAddress,
    activeChainId
  });

  const { isLoading: isApproveTransactionConfirming } = useTransactionStatus({
    hash: approveData,
    onSuccess: (data) => {
      updateOperationStatus('approve', 0);
      if (approveData) {
        approveReset();
        onSuccessLatest?.(data);
      }
    },
    onError: () => {
      approveReset();
      updateOperationStatus('approve', 0);
      onErrorLatest ?? (() => null);
    }
  });
  const needApprove = !allowance || allowance < amount;

  const isApproveAvailable =
    getOperationStatus(operationStatusMap, ownerAddress, activeChainId, 'approve') === 1;

  return {
    allowance,
    refetchAllowance,
    allowanceQueryKey,
    isAllowanceLoading: isAllowanceLoading || isAllowanceRefetching,
    approve,
    isApproving: isApproveAvailable && isApproving,
    isApproveTransactionConfirming: isApproveAvailable && isApproveTransactionConfirming,
    needApprove
  };
};
