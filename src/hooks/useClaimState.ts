import { useMemo } from 'react';

export type UseClaimStateType = {
  isConnected: boolean;
  isCorrectChainId: boolean;
  isClaiming: boolean;
  isClaimTransactionConfirming: boolean;
  isLoadingOrRefetching: boolean;
  value: bigint;
};
export const useClaimState = ({
  isConnected,
  isCorrectChainId,
  isClaiming,
  isClaimTransactionConfirming,
  isLoadingOrRefetching,
  value
}: UseClaimStateType) => {
  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isCorrectChainId) return 'Wrong Network';
    if (isClaiming) return 'Preparing Claim';
    if (isClaimTransactionConfirming) return 'Confirming Claim';
    if (isLoadingOrRefetching) return 'Preparing...';

    return 'Claim';
  }, [
    isConnected,
    isCorrectChainId,
    isClaiming,
    isClaimTransactionConfirming,
    isLoadingOrRefetching
  ]);

  const isButtonDisabled =
    isLoadingOrRefetching || !isConnected || !isCorrectChainId || value === 0n;

  return { buttonText, isButtonDisabled };
};
