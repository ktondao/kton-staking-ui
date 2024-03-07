'use client';
import { useAccount } from 'wagmi';
import { useEffect, memo } from 'react';

import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import Loading from '@/components/loading';
import { formatNumericValue } from '@/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClaim } from '@/hooks/useClaim';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useClaimState } from '@/hooks/useClaimState';

type ClaimProps = {
  onTransactionActiveChange?: (isTransaction: boolean) => void;
};
const Claim = ({ onTransactionActiveChange }: ClaimProps) => {
  const { address, isConnected } = useAccount();
  const { isCorrectChainId, activeChain } = useChain();

  const { value, formatted, isLoadingOrRefetching, refetch } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'earned',
    args: [address!]
  });

  const { claim, isClaiming, claimData, isClaimTransactionConfirming } = useClaim({
    ownerAddress: address!,
    onSuccess() {
      if (claimData) {
        refetch();
      }
    }
  });

  const { buttonText, isButtonDisabled } = useClaimState({
    isConnected,
    isCorrectChainId,
    isClaiming,
    isClaimTransactionConfirming,
    isLoadingOrRefetching,
    value
  });

  const rewardAmount = formatNumericValue(formatted);

  useEffect(() => {
    const isActive = isClaiming || isClaimTransactionConfirming;
    onTransactionActiveChange && onTransactionActiveChange(isActive);
  }, [isClaiming, isClaimTransactionConfirming, onTransactionActiveChange]);

  return (
    <div>
      <div className="flex h-[4.5rem] items-center justify-center gap-3 self-stretch rounded-[0.3125rem] bg-[#1A1D1F]">
        {isLoadingOrRefetching ? (
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
        disabled={isButtonDisabled}
        isLoading={isClaiming || isClaimTransactionConfirming}
        type="button"
        onClick={claim}
        className="mt-5 w-full rounded-[0.3125rem] text-[0.875rem] text-white"
      >
        {isLoadingOrRefetching ? <span className="animate-pulse"> {buttonText}</span> : buttonText}
      </Button>
    </div>
  );
};
export default memo(Claim);
