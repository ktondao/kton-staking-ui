import { useAccount } from 'wagmi';
import { useMemo } from 'react';

import { useTokenAllowance } from './useTokenAllowance';
import { useTokenApprove } from './useTokenApprove';
import { useTransactionStatus } from './useTransactionStatus';
import { useChain } from './useChain';

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
  const { isConnected } = useAccount();
  const { activeChainId } = useChain();

  const { isAllowanceLoading, allowance, refetchAllowance } = useTokenAllowance({
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
      approveData && refetchAllowance();
    }
  });
  const needApprove = useMemo(() => !allowance || allowance < amount, [allowance, amount]);

  return {
    allowance,
    refetchAllowance,
    isAllowanceLoading,
    approve,
    isApproving,
    isApproveTransactionConfirming,
    needApprove
  };
};
