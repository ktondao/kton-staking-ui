'use client';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import { useStakedKTONAmount } from '@/hooks/useStakedKTONAmount';
import { useUnStake } from '@/hooks/useUnStake';
import { usePoolAmount } from '@/hooks/usePoolAmount';

import AmountInputForm from './amount-input-form';
import KTONBalance from './kton-balance';

import type { Form, SubmitData } from './amount-input-form';

type UnStakeProps = {
  onTransactionActiveChange?: (isTransaction: boolean) => void;
};
const UnStake = ({ onTransactionActiveChange }: UnStakeProps) => {
  const formRef: MutableRefObject<Form | null> = useRef(null);
  const [amount, setAmount] = useState<bigint>(0n);
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useChain();
  const queryClient = useQueryClient();

  const { refetch: refetchPoolAmount, queryKey: poolAmountQueryKey } = usePoolAmount();

  const {
    isLoading: isAmountLoading,
    formatted: ktonEtherAmount,
    refetch: refetchBalance,
    queryKey: stakedKTONQueryKey
  } = useStakedKTONAmount({
    ownerAddress: address!
  });

  const { unStake, isUnStaking, isUnstakeTransactionConfirming } = useUnStake({
    ownerAddress: address!,
    onSuccess() {
      refetchBalance();
      queryClient.setQueryData(stakedKTONQueryKey, (oldData: bigint) => {
        return (oldData || 0n) - (amount || 0n);
      });

      refetchPoolAmount();
      queryClient.setQueryData(poolAmountQueryKey, (oldData: bigint) => {
        return (oldData || 0n) - (amount || 0n);
      });

      formRef.current?.setValue('amount', '');
    }
  });

  const handleAmountChange = useCallback((amount: string) => {
    if (amount) {
      setAmount(parseEther(amount));
    } else {
      setAmount(0n);
    }
  }, []);

  const handleSubmit = useCallback(
    (data: SubmitData) => {
      unStake(data.amount);
    },
    [unStake]
  );

  const buttonText = useMemo(() => {
    if (!isConnected) {
      return 'Wallet Disconnected';
    }
    if (!isCorrectChainId) {
      return 'Wrong Network';
    }
    if (isUnStaking) {
      return 'Preparing Transaction';
    }
    if (isUnstakeTransactionConfirming) {
      return 'Confirming Transaction';
    }
    if (isAmountLoading) {
      return 'Preparing';
    }

    return 'Unstake';
  }, [isConnected, isCorrectChainId, isAmountLoading, isUnstakeTransactionConfirming, isUnStaking]);

  useEffect(() => {
    const isActive = isUnStaking || isUnstakeTransactionConfirming;
    onTransactionActiveChange && onTransactionActiveChange(isActive);
  }, [isUnStaking, isUnstakeTransactionConfirming, onTransactionActiveChange]);

  return (
    <AmountInputForm
      ref={formRef}
      key="stake"
      etherBalance={ktonEtherAmount}
      renderBalance={
        isConnected ? (
          <KTONBalance
            symbol={activeChain?.ktonToken?.symbol}
            isPending={isAmountLoading}
            etherBalance={ktonEtherAmount}
          />
        ) : (
          '0 KTON'
        )
      }
      onSubmit={handleSubmit}
      onAmountChange={handleAmountChange}
    >
      <Button
        disabled={!isConnected || isAmountLoading || !isCorrectChainId || !amount}
        type="submit"
        isLoading={isUnStaking || isUnstakeTransactionConfirming}
        className={cn('mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {isAmountLoading ? <span className=" animate-pulse"> {buttonText}</span> : buttonText}
      </Button>
    </AmountInputForm>
  );
};
export default UnStake;
