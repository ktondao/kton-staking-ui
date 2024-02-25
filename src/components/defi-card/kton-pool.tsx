'use client';

import Image from 'next/image';
import Loading from '@/components/loading';
import { formatNumericValue } from '@/utils';
import { useReadContract } from 'wagmi';
import { useApp } from '@/hooks/useApp';
import { useMemo } from 'react';
import { abi } from '@/config/abi/KTONStakingRewards';
import { formatEther } from 'viem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KTONPoolProps {}

const KTONPool = ({}: KTONPoolProps) => {
  const { activeChain } = useApp();
  const { data, isPending, error } = useReadContract({
    address: activeChain?.stakingContractAddress,
    abi,
    functionName: 'totalSupply'
  });

  console.log('data', data, error);

  const totalSupply = useMemo(() => {
    if (typeof data === 'bigint') {
      console.log('fromatEther', formatEther(data));
      return formatNumericValue(formatEther(data));
    }
  }, [data]);
  return (
    <div className="flex h-[11rem] w-full flex-col items-center justify-center gap-[0.625rem] rounded-[0.3125rem;] bg-[#1A1D1F] p-[1.25rem]">
      <div className="rounded-full">
        {activeChain?.ktonToken?.logoPath ? (
          <Image
            src={activeChain?.ktonToken?.logoPath}
            alt="kton icon"
            width={70}
            height={70}
            className="h-[4.375rem] w-[4.375rem] rounded-full"
            style={{
              filter: 'drop-shadow(0px 4px 30px hsl(var(--primary))) '
            }}
          />
        ) : null}
      </div>
      <div className="flex flex-col items-center">
        <h2 className=" text-center text-[0.875rem] font-light leading-6 text-white">
          TOTAL {activeChain?.ktonToken?.symbol} POOL
        </h2>
        <div className="flex items-center justify-center">
          {isPending ? (
            <Loading className="mt-2" />
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <>
                    <span className="text-[1.5rem] font-bold leading-normal text-primary">
                      {totalSupply?.integerPart}
                    </span>
                    {totalSupply?.decimalPart ? (
                      <span className="text-[1.5rem] font-bold leading-normal text-[rgba(255,255,255,.5)]">
                        .{totalSupply?.decimalPart}
                      </span>
                    ) : null}
                  </>
                </TooltipTrigger>
                <TooltipContent>
                  {totalSupply?.originalFormatNumberWithThousandsSeparator}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};
export default KTONPool;
