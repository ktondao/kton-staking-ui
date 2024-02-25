'use client';
import { Button } from '@/components/ui/button';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useApp } from '@/hooks/useApp';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import Loading from '@/components/loading';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { formatNumericValue } from '@/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useClaim } from '@/hooks/useClaim';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';

const Claim = () => {
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useApp();

  const { isLoading, value, formatted, refetch } = useBigIntContractQuery({
    contractAddress: activeChain?.stakingContractAddress,
    abi: abi,
    functionName: 'earned',
    args: [address]
  });

  const { claim, isClaiming, claimData } = useClaim({
    contractAddress: activeChain?.stakingContractAddress,
    ownerAddress: address!
  });

  const { isLoading: isTransactionReceipt } = useTransactionStatus({
    hash: claimData,
    onSuccess() {
      refetch();
    }
  });

  const rewardAmount = useMemo(() => {
    return formatNumericValue(formatted);
  }, [formatted]);

  const buttonText = useMemo(() => {
    if (!isConnected) {
      return 'Wallet Disconnected';
    }
    if (!isCorrectChainId) {
      return 'Wrong Network';
    }
    if (isLoading) {
      return 'Checking Rewards...';
    }
    if (value === 0n) {
      return 'No Rewards';
    }
    if (isClaiming || isTransactionReceipt) {
      return 'Claiming';
    }
    return 'Claim';
  }, [isConnected, isCorrectChainId, isLoading, value, isClaiming, isTransactionReceipt]);

  return (
    <div>
      <div className="flex h-[4.5rem] items-center justify-center gap-3 self-stretch rounded-[0.3125rem] bg-[#1A1D1F]">
        {isLoading ? (
          <Loading className="ml-2 gap-1" itemClassName="size-2" />
        ) : (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  <span className=" text-[1.5rem] font-bold leading-normal text-white">
                    {rewardAmount?.integerPart}
                  </span>
                  {rewardAmount?.decimalPart ? (
                    <span className=" text-[1.5rem] font-bold leading-normal text-white/50">
                      .{rewardAmount?.decimalPart}
                    </span>
                  ) : null}
                </div>
              </TooltipTrigger>
              <TooltipContent asChild>
                <span>{rewardAmount?.originalFormatNumberWithThousandsSeparator}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <span className=" text-[1.5rem] font-bold leading-normal text-white">RING</span>
      </div>
      <Button
        disabled={value === 0n || isLoading || !isConnected || !isCorrectChainId}
        isLoading={isClaiming || isTransactionReceipt}
        type="submit"
        onClick={claim}
        className="mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white"
      >
        {buttonText}
      </Button>
    </div>
  );
};
export default Claim;
