import { useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';

import type { ChainId } from '@/types/chains';

interface UseTokenAllowanceProps {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  isConnected: boolean;
  activeChainId: ChainId;
}

export function useTokenAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  isConnected,
  activeChainId
}: UseTokenAllowanceProps) {
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    isRefetching: isAllowanceRefetching,
    refetch: refetchAllowance
  } = useReadContract({
    chainId: activeChainId,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
    query: {
      enabled: isConnected
    }
  });

  return {
    isAllowanceLoading: isAllowanceLoading || isAllowanceRefetching,
    refetchAllowance,
    allowance
  };
}
