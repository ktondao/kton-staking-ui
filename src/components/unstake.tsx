'use client';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import { useUnStake } from '@/hooks/useUnStake';
import { usePoolAmount } from '@/hooks/usePoolAmount';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';

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

  const { refetch: refetchPoolAmount } = usePoolAmount();

  const {
    formatted: ktonEtherAmount,
    isLoadingOrRefetching: isAmountLoading,
    refetch: refetchBalance
  } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'balanceOf',
    args: [address!]
  });

  const { unStake, isUnStaking, isUnstakeTransactionConfirming } = useUnStake({
    ownerAddress: address!,
    onSuccess() {
      refetchBalance();
      refetchPoolAmount();
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
