'use client';
import { useApp } from '@/hooks/useApp';
import { useAccount } from 'wagmi';
import KTONAction from './kton-action';
import { Button } from '@/components/ui/button';
import { parseEther } from 'viem';
import { useTokenAllowanceAndApprove } from '@/hooks/useTokenAllowanceAndApprove';
import { cn } from '@/lib/utils';
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { useStakedKTONAmount } from '@/hooks/useStakedKTONAmount';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { useUnStake } from '@/hooks/useUnStake';
import KTONBalance from './kton-balance';

import type { Form, SubmitData } from './kton-action';
import { usePoolAmount } from '@/hooks/usePoolAmount';

const UnStake = () => {
  const formRef: MutableRefObject<Form | null> = useRef(null);
  const [amount, setAmount] = useState<bigint>(0n);
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useApp();

  const { refetch: refetchPoolAmount } = usePoolAmount();

  const {
    isLoading: isAmountLoading,
    formatted: ktonEtherAmount,
    refetch
  } = useStakedKTONAmount({
    ownerAddress: address!
  });

  const { allowance, isAllowanceLoading, approve, isApproving, approveData } =
    useTokenAllowanceAndApprove({
      tokenAddress: activeChain?.ktonToken.address,
      ownerAddress: address!,
      spenderAddress: activeChain?.stakingContractAddress
    });

  const { unStake, isUnStaking, unStakeData } = useUnStake({
    ownerAddress: address!
  });

  const { isLoading: isTransactionConfirming } = useTransactionStatus({
    hash: approveData || unStakeData,
    onSuccess: () => {
      if (unStakeData) {
        refetch();
        refetchPoolAmount();
      }
    }
  });

  const needApprove = !allowance || allowance < amount;

  const handleAmountChange = useCallback((amount: string) => {
    if (amount) {
      setAmount(parseEther(amount));
    }
  }, []);

  const handleSubmit = useCallback(
    (data: SubmitData) => {
      if (needApprove) {
        approve(data.amount);
      } else {
        unStake(data.amount)?.finally(() => {
          formRef.current?.setValue('amount', '');
        });
      }
    },
    [approve, needApprove, unStake]
  );

  const buttonText = useMemo(() => {
    if (!isConnected) {
      return 'Wallet Disconnected';
    }
    if (!isCorrectChainId) {
      return 'Wrong Network';
    }
    if (isAmountLoading || isAllowanceLoading) {
      return 'Preparing...';
    }
    if (amount === 0n) {
      return 'Enter Amount';
    }
    if (needApprove) {
      return 'Approve';
    }
    if (isApproving || isUnStaking) {
      return 'Preparing Transaction';
    }
    if (isTransactionConfirming) {
      return 'Confirming Transaction';
    }
    return 'Unstake';
  }, [
    isConnected,
    isCorrectChainId,
    isAmountLoading,
    isAllowanceLoading,
    needApprove,
    isApproving,
    isTransactionConfirming,
    isUnStaking,
    amount
  ]);

  return (
    <KTONAction
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
        disabled={
          isAllowanceLoading || !isConnected || !isAmountLoading || !isCorrectChainId || !amount
        }
        type="submit"
        isLoading={isApproving || isUnStaking}
        className={cn('mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {buttonText}
      </Button>
    </KTONAction>
  );
};
export default UnStake;
