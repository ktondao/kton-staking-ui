import { useMemo } from 'react';

export type UseClaimStateType = {
  isConnected: boolean;
  isSupportedChainId: boolean;
  isClaiming: boolean;
  isClaimTransactionConfirming: boolean;
  isLoadingOrRefetching: boolean;
  value: bigint;
};
export const useClaimState = ({
  isConnected,
  isSupportedChainId,
  isClaiming,
  isClaimTransactionConfirming,
  isLoadingOrRefetching,
  value
}: UseClaimStateType) => {
  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isSupportedChainId) return 'Wrong Network';
    if (isClaiming) return 'Preparing Claim';
    if (isClaimTransactionConfirming) return 'Confirming Claim';
    if (isLoadingOrRefetching) return 'Preparing...';

    return 'Claim';
  }, [
    isConnected,
    isSupportedChainId,
    isClaiming,
    isClaimTransactionConfirming,
    isLoadingOrRefetching
  ]);

  const isButtonDisabled =
    isLoadingOrRefetching || !isConnected || !isSupportedChainId || value === 0n;

  const isFetching = isConnected && isSupportedChainId && isLoadingOrRefetching;

  return { buttonText, isButtonDisabled, isFetching };
};
