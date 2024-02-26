import { useCallback, useEffect, useRef } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';
import { toast } from 'sonner';

import { abi } from '@/config/abi/KTONStakingRewards';

import { useApp } from './useApp';

interface UseStakeProps {
  ownerAddress: `0x${string}`;
}

export function useStake({ ownerAddress }: UseStakeProps) {
  const toastRef = useRef<string | number | null>(null);

  const { activeChainId, activeChain } = useApp();

  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const stake = useCallback(
    async (amount: string): Promise<WriteContractReturnType> => {
      return await writeContractAsync({
        chainId: activeChainId,
        abi,
        address: activeChain?.stakingContractAddress,
        account: ownerAddress!,
        functionName: 'stake',
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
    stake,
    isStaking: isPending,
    stakeData: data,
    isStakeSuccess: isSuccess,
    isStakeError: isError,
    skateFailureReason: failureReason
  };
}
