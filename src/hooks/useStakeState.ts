import { useMemo } from 'react';

export type UseStakeStateType = {
  isConnected: boolean;
  isCorrectChainId: boolean;
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
  isCorrectChainId,
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
    if (!isCorrectChainId) return 'Wrong Network';
    if (isApproving) return 'Preparing Approval';
    if (isApproveTransactionConfirming) return 'Confirming Approval';
    if (isStaking) return 'Preparing Stake';
    if (isStakeTransactionConfirming) return 'Confirming Stake';
    if (isBalanceLoading || isAllowanceLoading) return 'Preparing...';
    if (amount !== 0n && needApprove) return 'Approve';
    return 'Stake';
  }, [
    isConnected,
    isCorrectChainId,
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
    isAllowanceLoading || isBalanceLoading || !isConnected || !isCorrectChainId || amount === 0n;

  return { buttonText, isButtonDisabled };
};
