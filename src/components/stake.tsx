'use client';
import { useAccount } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';

import { useTokenAllowanceAndApprove } from '@/hooks/useTokenAllowanceAndApprove';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { useStake } from '@/hooks/useStake';
import { usePoolAmount } from '@/hooks/usePoolAmount';

import KTONAction from './kton-action';
import KTONBalance from './kton-balance';

import type { Form, SubmitData } from './kton-action';

const Stake = () => {
  const formRef: MutableRefObject<Form | null> = useRef(null);
  const [amount, setAmount] = useState<bigint>(0n);
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useApp();

  const { refetch: refetchPoolAmount } = usePoolAmount();
  const {
    isLoading: isBalanceLoading,
    formatted: ktonEtherBalance,
    refetch
  } = useBigIntContractQuery({
    contractAddress: activeChain?.ktonToken.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
  });

  const { allowance, isAllowanceLoading, approve, isApproving, approveData } =
    useTokenAllowanceAndApprove({
      tokenAddress: activeChain?.ktonToken.address,
      ownerAddress: address!,
      spenderAddress: activeChain?.stakingContractAddress
    });

  const { stake, isStaking, stakeData } = useStake({
    ownerAddress: address!
  });

  const { isLoading: isTransactionConfirming } = useTransactionStatus({
    hash: approveData || stakeData,
    onSuccess: () => {
      if (stakeData) {
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
        stake(data.amount)?.finally(() => {
          formRef.current?.setValue('amount', '');
        });
      }
    },
    [approve, needApprove, stake]
  );

  const buttonText = useMemo(() => {
    if (!isConnected) {
      return 'Wallet Disconnected';
    }
    if (!isCorrectChainId) {
      return 'Wrong Network';
    }
    if (isBalanceLoading || isAllowanceLoading) {
      return 'Preparing...';
    }
    if (amount === 0n) {
      return 'Enter Amount';
    }
    if (needApprove) {
      return 'Approve';
    }
    if (isApproving || isStaking) {
      return 'Preparing Transaction';
    }
    if (isTransactionConfirming) {
      return 'Confirming Transaction';
    }
    return 'Stake';
  }, [
    isConnected,
    isCorrectChainId,
    isBalanceLoading,
    isAllowanceLoading,
    needApprove,
    isApproving,
    isTransactionConfirming,
    isStaking,
    amount
  ]);

  return (
    <KTONAction
      ref={formRef}
      key="stake"
      etherBalance={ktonEtherBalance}
      renderBalance={
        isConnected ? (
          <KTONBalance
            symbol={activeChain?.ktonToken?.symbol}
            isPending={isBalanceLoading}
            etherBalance={ktonEtherBalance}
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
          isAllowanceLoading || isBalanceLoading || !isConnected || !isCorrectChainId || !amount
        }
        type="submit"
        isLoading={isApproving || isStaking}
        className={cn('mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {isAllowanceLoading || isBalanceLoading ? (
          <span className=" animate-pulse"> {buttonText}</span>
        ) : (
          buttonText
        )}
      </Button>
    </KTONAction>
  );
};
export default Stake;
