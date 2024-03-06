'use client';

import { useAccount } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useChain } from '@/hooks/useChain';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useTokenAllowanceAndApprove } from '@/hooks/useTokenAllowanceAndApprove';
import { useStake } from '@/hooks/useStake';
import { usePoolAmount } from '@/hooks/usePoolAmount';
import { useStakeState } from '@/hooks/useStakeState';

import AmountInputForm from './amount-input-form';
import KTONBalance from './kton-balance';

import type { Form, SubmitData } from './amount-input-form';

type StakeProps = {
  onTransactionActiveChange?: (isTransaction: boolean) => void;
};
const Stake = ({ onTransactionActiveChange }: StakeProps) => {
  const formRef: MutableRefObject<Form | null> = useRef(null);
  const amountRef: MutableRefObject<bigint> = useRef(0n);
  const [amount, setAmount] = useState<bigint>(0n);

  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useChain();
  const { refetch: refetchPoolAmount } = usePoolAmount();

  const {
    isLoadingOrRefetching: isBalanceLoading,
    formatted: formattedBalance,
    refetch: refetchBalance
  } = useBigIntContractQuery({
    contractAddress: activeChain?.ktonToken.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!]
  });

  const {
    isAllowanceLoading,
    refetchAllowance,
    allowanceQueryKey,
    approve,
    isApproving,
    isApproveTransactionConfirming,
    needApprove
  } = useTokenAllowanceAndApprove({
    tokenAddress: activeChain?.ktonToken.address,
    ownerAddress: address!,
    spenderAddress: activeChain?.stakingContractAddress,
    amount,
    onSuccess: () => {
      queryClient.setQueryData(allowanceQueryKey, () => {
        return amountRef.current || 0n;
      });
    }
  });

  const { stake, isStaking, isStakeTransactionConfirming } = useStake({
    ownerAddress: address!,
    onSuccess: () => {
      refetchBalance();
      refetchAllowance();
      refetchPoolAmount();
      formRef.current?.setValue('amount', '');
    }
  });

  const { isButtonDisabled, buttonText } = useStakeState({
    isConnected,
    isCorrectChainId,
    isBalanceLoading,
    isAllowanceLoading,
    needApprove,
    isApproving,
    isApproveTransactionConfirming,
    isStaking,
    isStakeTransactionConfirming,
    amount
  });

  useEffect(() => {
    const isActive =
      isApproving || isStaking || isApproveTransactionConfirming || isStakeTransactionConfirming;
    onTransactionActiveChange && onTransactionActiveChange(isActive);
  }, [
    isApproving,
    isStaking,
    isApproveTransactionConfirming,
    isStakeTransactionConfirming,
    onTransactionActiveChange
  ]);

  const handleAmountChange = useCallback((amount: string) => {
    if (amount) {
      setAmount(parseEther(amount));
    } else {
      setAmount(0n);
    }
  }, []);

  const handleSubmit = useCallback(
    (data: SubmitData) => {
      if (needApprove) {
        amountRef.current = parseEther(data.amount);
        approve(data.amount);
      } else {
        amountRef.current = parseEther(data.amount);
        stake(data.amount);
      }
    },
    [approve, needApprove, stake]
  );

  return (
    <AmountInputForm
      ref={formRef}
      key="stake"
      etherBalance={formattedBalance}
      renderBalance={
        isConnected ? (
          <KTONBalance
            symbol={activeChain?.ktonToken?.symbol}
            isPending={isBalanceLoading}
            etherBalance={formattedBalance}
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
        isLoading={
          isApproving || isApproveTransactionConfirming || isStaking || isStakeTransactionConfirming
        }
        className={cn('mt-5 w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {isAllowanceLoading || isBalanceLoading ? (
          <span className="animate-pulse"> {buttonText}</span>
        ) : (
          buttonText
        )}
      </Button>
    </AmountInputForm>
  );
};
export default Stake;
