import { useMemo } from 'react';

export type UseUnStakeStateType = {
  isConnected: boolean;
  isSupportedChainId: boolean;
  isAmountLoading: boolean;
  isUnStaking: boolean;
  isUnstakeTransactionConfirming: boolean;
  amount: bigint;
};
export const useUnStakeState = ({
  isConnected,
  isSupportedChainId,
  isAmountLoading,
  isUnStaking,
  isUnstakeTransactionConfirming,
  amount
}: UseUnStakeStateType) => {
  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isSupportedChainId) return 'Wrong Network';
    if (isUnStaking) return 'Preparing Unstake';
    if (isUnstakeTransactionConfirming) return 'Confirming Unstake';
    if (isAmountLoading) return 'Preparing...';

    return 'Unstake';
  }, [
    isConnected,
    isSupportedChainId,
    isAmountLoading,
    isUnstakeTransactionConfirming,
    isUnStaking
  ]);

  const isButtonDisabled = isAmountLoading || !isConnected || !isSupportedChainId || !amount;

  const isFetching = isConnected && isSupportedChainId && isAmountLoading;

  return { buttonText, isButtonDisabled, isFetching };
};
