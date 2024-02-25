import { formatNumberWithThousandsSeparator, toFixed } from '@/utils';
import Loading from '@/components/loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KTONBalanceProps {
  symbol: string;
  isPending: boolean;
  etherBalance: string;
}

const KTONBalance = ({ symbol, isPending, etherBalance }: KTONBalanceProps) => {
  if (!symbol) return null;

  return isPending ? (
    <Loading className="ml-2 gap-1" itemClassName="size-2" />
  ) : (
    <span className="space-x-1">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="cursor-pointer">
              {formatNumberWithThousandsSeparator(toFixed(etherBalance, 3))}
            </span>
          </TooltipTrigger>
          <TooltipContent asChild>
            <span>{formatNumberWithThousandsSeparator(etherBalance)}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span>{symbol}</span>
    </span>
  );
};
export default KTONBalance;
