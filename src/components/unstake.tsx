'use client';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import { useUnStake } from '@/hooks/useUnStake';
import { usePoolAmount } from '@/hooks/usePoolAmount';
import { abi } from '@/config/abi/KTONStakingRewards';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useUnStakeState } from '@/hooks/useUnstakeState';

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
  const { activeChain, isSupportedChainId } = useChain();

  const { refetch: refetchPoolAmount } = usePoolAmount();

  const {
    formatted: ktonEtherAmount,
    isLoadingOrRefetching: isAmountLoading,
    refetch: refetchBalance
  } = useBigIntContractQuery({
    contractAddress: activeChain.stakingContractAddress,
    abi,
    functionName: 'balanceOf',
    args: [address!],
    forceEnabled: isSupportedChainId
  });

  const { unStake, isUnStaking, isUnstakeTransactionConfirming } = useUnStake({
    ownerAddress: address!,
    onSuccess() {
      refetchBalance();
      refetchPoolAmount();
      formRef.current?.setValue('amount', '');
    }
  });

  const { buttonText, isButtonDisabled, isFetching } = useUnStakeState({
    isConnected,
    isSupportedChainId,
    isAmountLoading,
    isUnStaking,
    isUnstakeTransactionConfirming,
    amount
  });

  const handleAmountChange = useCallback((amount: string) => {
    setAmount(amount ? parseEther(amount) : 0n);
  }, []);

  const handleSubmit = useCallback(
    (data: SubmitData) => {
      unStake(data.amount);
    },
    [unStake]
  );

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
          `0 ${activeChain.ktonToken?.symbol}`
        )
      }
      onSubmit={handleSubmit}
      onAmountChange={handleAmountChange}
    >
      <Button
        disabled={isButtonDisabled}
        type="submit"
        isLoading={isUnStaking || isUnstakeTransactionConfirming}
        className={cn('mt-5 w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {isFetching ? <span className=" animate-pulse"> {buttonText}</span> : buttonText}
      </Button>
    </AmountInputForm>
  );
};
export default UnStake;
