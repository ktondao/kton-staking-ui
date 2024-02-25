import { useCallback, useEffect, useRef } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';
import { toast } from 'sonner';

import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface UseUnStakeProps {
  ownerAddress: `0x${string}`;
}

export function useUnStake({ ownerAddress }: UseUnStakeProps) {
  const { activeChainId, activeChain } = useApp();
  const toastRef = useRef<string | number | null>(null);

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const unStake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'withdraw',
        args: [parseEther(amount)]
      });
    },
    [activeChain?.stakingContractAddress, activeChainId, ownerAddress, writeContractAsync]
  );

  useEffect(() => {
    if (isError) {
      toastRef.current = toast(failureReason?.message || 'Stake failed', {
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
    unStake,
    isUnStaking: isPending,
    unStakeData: data,
    isUnStakeSuccess: isSuccess,
    isUnStakeError: isError,
    unStakeFailureReason: failureReason
  };
}
