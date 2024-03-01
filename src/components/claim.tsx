'use client';
import { useAccount } from 'wagmi';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import Loading from '@/components/loading';
import { formatNumericValue } from '@/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClaim } from '@/hooks/useClaim';
import { useRingRewardAmount } from '@/hooks/useRingRewardAmount';

type ClaimProps = {
  onTransactionActiveChange?: (isTransaction: boolean) => void;
};
const Claim = ({ onTransactionActiveChange }: ClaimProps) => {
  const { address, isConnected } = useAccount();
  const { isCorrectChainId } = useChain();

  const { isLoading, value, formatted, refetch } = useRingRewardAmount({
    ownerAddress: address!
  });

  const { claim, isClaiming, claimData, isClaimTransactionConfirming } = useClaim({
    ownerAddress: address!,
    onSuccess() {
      claimData && refetch();
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
    if (isClaiming) {
      return 'Preparing Transaction';
    }
    if (isClaimTransactionConfirming) {
      return 'Confirming Transaction';
    }
    if (isLoading) {
      return 'Preparing';
    }
    if (value === 0n) {
      return 'No Rewards';
    }

    return 'Claim';
  }, [isConnected, isCorrectChainId, isLoading, value, isClaiming, isClaimTransactionConfirming]);

  useEffect(() => {
    const isActive = isClaiming || isClaimTransactionConfirming;
    onTransactionActiveChange && onTransactionActiveChange(isActive);
  }, [isClaiming, isClaimTransactionConfirming, onTransactionActiveChange]);

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
        isLoading={isClaiming || isClaimTransactionConfirming}
        type="submit"
        onClick={claim}
        className="mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white"
      >
        {isLoading ? <span className=" animate-pulse"> {buttonText}</span> : buttonText}
      </Button>
    </div>
  );
};
export default Claim;
