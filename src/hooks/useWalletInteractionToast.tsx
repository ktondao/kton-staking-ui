import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { removeVersionFromErrorMessage } from '@/utils';

import type { DefaultError } from '@tanstack/react-query';

interface UseWalletInteractionToastProps {
  isError: boolean;
  isSuccess: boolean;
  failureReason: DefaultError | null;
}

export function useWalletInteractionToast({
  isError,
  isSuccess,
  failureReason
}: UseWalletInteractionToastProps) {
  const toastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isError) {
      toastRef.current = toast(
        removeVersionFromErrorMessage(failureReason?.message, 'Stake failed'),
        {
          duration: 5000,
          classNames: {
            toast: 'group-[.toaster]:border-red-500',
            closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
          }
        }
      );
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
}
