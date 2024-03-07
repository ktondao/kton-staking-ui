import { useMemo } from 'react';

export type UseUnStakeStateType = {
  isConnected: boolean;
  isCorrectChainId: boolean;
  isAmountLoading: boolean;
  isUnStaking: boolean;
  isUnstakeTransactionConfirming: boolean;
  amount: bigint;
};
export const useUnStakeState = ({
  isConnected,
  isCorrectChainId,
  isAmountLoading,
  isUnStaking,
  isUnstakeTransactionConfirming,
  amount
}: UseUnStakeStateType) => {
  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isCorrectChainId) return 'Wrong Network';
    if (isUnStaking) return 'Preparing Unstake';
    if (isUnstakeTransactionConfirming) return 'Confirming Unstake';
    if (isAmountLoading) return 'Preparing...';

    return 'Unstake';
  }, [isConnected, isCorrectChainId, isAmountLoading, isUnstakeTransactionConfirming, isUnStaking]);

  const isButtonDisabled = isAmountLoading || !isConnected || !isCorrectChainId || !amount;

  return { buttonText, isButtonDisabled };
};
