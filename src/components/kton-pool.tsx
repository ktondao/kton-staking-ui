'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import Loading from '@/components/loading';
import { formatNumericValue } from '@/utils';
import { useChain } from '@/hooks/useChain';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePoolAmount } from '@/hooks/usePoolAmount';

const KTONPool = () => {
  const { activeChain } = useChain();
  const { isLoading, formatted } = usePoolAmount();

  const totalSupply = useMemo(() => {
    return formatNumericValue(formatted);
  }, [formatted]);

  return (
    <div className="flex h-[11rem] w-full flex-col items-center justify-center gap-[0.625rem] rounded-[0.3125rem] bg-[#1A1D1F] p-[1.25rem]">
      <div className="rounded-full">
        {activeChain?.ktonToken?.logoPath ? (
          <Image
            src={activeChain?.ktonToken?.logoPath}
            alt="kton icon"
            width={70}
            priority
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
          {isLoading ? (
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
                      <span className="text-[1.5rem] font-bold leading-normal text-white/50">
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
