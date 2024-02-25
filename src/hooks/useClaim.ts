import { useCallback, useEffect, useRef } from 'react';
import { useWriteContract } from 'wagmi';
import { WriteContractReturnType, parseEther } from 'viem';
import { toast } from 'sonner';

import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from './useApp';

interface useClaimProps {
  ownerAddress: `0x${string}`;
}

export function useClaim({ ownerAddress }: useClaimProps) {
  const toastRef = useRef<string | number | null>(null);
  const { activeChainId, activeChain } = useApp();
  const { writeContractAsync, isPending, isError, isSuccess, failureReason, data } =
    useWriteContract();

  const claim = useCallback(async (): Promise<WriteContractReturnType> => {
    return await writeContractAsync({
      chainId: activeChainId,
      abi,
      address: activeChain.stakingContractAddress,
      account: ownerAddress!,
      functionName: 'getReward',
      args: []
    });
  }, [activeChain.stakingContractAddress, activeChainId, ownerAddress, writeContractAsync]);

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
    claim,
    isClaiming: isPending,
    claimData: data,
    isClaimSuccess: isSuccess,
    isClaimError: isError,
    claimFailureReason: failureReason
  };
}
