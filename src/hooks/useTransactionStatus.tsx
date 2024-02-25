import { Config, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WaitForTransactionReceiptData } from 'wagmi/query';
import { ChainId } from '@/types/chains';
import { getChainById } from '@/utils';
import { useApp } from './useApp';

interface UseTransactionStatusProps {
  hash: `0x${string}` | undefined;
  onSuccess?: (data: WaitForTransactionReceiptData<Config, ChainId>) => void;
  onError?: () => void;
}

export function useTransactionStatus({ hash, onSuccess, onError }: UseTransactionStatusProps) {
  const { activeChainId } = useApp();
  const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    chainId: activeChainId
  });

  const toastRef = useRef<string | number | null>(null);
  const onSuccessRef = useRef<typeof onSuccess | null>(null);
  const onErrorRef = useRef<typeof onError | null>(null);

  useEffect(() => {
    onSuccessRef.current = onSuccess ?? null;
    onErrorRef.current = onError ?? null;
  }, [onSuccess, onError]);

  useEffect(() => {
    if ((isSuccess || isError) && data) {
      const chain = getChainById(data.chainId);
      const statusMessage = isSuccess ? 'The transaction was successful' : 'The transaction failed';
      const toastClassName = isSuccess
        ? undefined
        : {
            toast: 'group-[.toaster]:border-red-500',
            closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
          };

      toastRef.current = toast(statusMessage, {
        description: (
          <a
            target="_blank"
            rel="noopener"
            className="break-all text-primary hover:underline"
            href={`${chain?.blockExplorers?.default?.url}tx/${data.transactionHash}`}
          >
            {data.transactionHash}
          </a>
        ),
        classNames: toastClassName
      });

      if (isSuccess) {
        onSuccessRef.current?.(data);
      } else {
        onErrorRef.current?.();
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isSuccess, isError, data]);

  return { isSuccess, isError, isLoading, data };
}
