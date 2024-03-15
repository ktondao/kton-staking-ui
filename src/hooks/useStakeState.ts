import { useMemo } from 'react';

export type UseStakeStateType = {
  isConnected: boolean;
  isSupportedChainId: boolean;
  isBalanceLoading: boolean;
  isAllowanceLoading: boolean;
  needApprove: boolean;
  isApproving: boolean;
  isApproveTransactionConfirming: boolean;
  isStaking: boolean;
  isStakeTransactionConfirming: boolean;
  amount: bigint;
};
export const useStakeState = ({
  isConnected,
  isSupportedChainId,
  isBalanceLoading,
  isAllowanceLoading,
  needApprove,
  isApproving,
  isApproveTransactionConfirming,
  isStaking,
  isStakeTransactionConfirming,
  amount
}: UseStakeStateType) => {
  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isSupportedChainId) return 'Wrong Network';
    if (isApproving) return 'Preparing Approval';
    if (isApproveTransactionConfirming) return 'Confirming Approval';
    if (isStaking) return 'Preparing Stake';
    if (isStakeTransactionConfirming) return 'Confirming Stake';
    if (isBalanceLoading || isAllowanceLoading) return 'Preparing...';
    if (amount !== 0n && needApprove) return 'Approve';
    return 'Stake';
  }, [
    isConnected,
    isSupportedChainId,
    isBalanceLoading,
    isAllowanceLoading,
    needApprove,
    isApproving,
    isApproveTransactionConfirming,
    isStakeTransactionConfirming,
    isStaking,
    amount
  ]);

  const isButtonDisabled =
    isAllowanceLoading || isBalanceLoading || !isConnected || !isSupportedChainId || amount === 0n;

  const isFetching = isConnected && isSupportedChainId && (isBalanceLoading || isAllowanceLoading);
  return { buttonText, isButtonDisabled, isFetching };
};
