'use client';

import { useAccount } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

type StakeProps = {
  onTransactionActiveChange?: (isTransaction: boolean) => void;
};
const Stake = ({ onTransactionActiveChange }: StakeProps) => {
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

  const { allowance, isAllowanceLoading, refetchAllowance, approve, isApproving, approveData } =
    useTokenAllowanceAndApprove({
      tokenAddress: activeChain?.ktonToken.address,
      ownerAddress: address!,
      spenderAddress: activeChain?.stakingContractAddress
    });

  const { stake, isStaking, stakeData } = useStake({
    ownerAddress: address!
  });

  const { isLoading: isApproveTransactionConfirming } = useTransactionStatus({
    hash: approveData,
    onSuccess: () => {
      approveData && refetchAllowance();
    }
  });

  const { isLoading: isStakeTransactionConfirming } = useTransactionStatus({
    hash: stakeData,
    onSuccess: () => {
      if (stakeData) {
        refetch();
        refetchAllowance();
        refetchPoolAmount();
        formRef.current?.setValue('amount', '');
      }
    }
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

  const needApprove = useMemo(() => !allowance || allowance < amount, [allowance, amount]);

  const buttonText = useMemo(() => {
    if (!isConnected) return 'Wallet Disconnected';
    if (!isCorrectChainId) return 'Wrong Network';
    if (isApproving) return 'Preparing Approval';
    if (isApproveTransactionConfirming) return 'Confirming Approval';
    if (isStaking) return 'Preparing Transaction';
    if (isStakeTransactionConfirming) return 'Confirming Transaction';
    if (isBalanceLoading || isAllowanceLoading) return 'Preparing...';
    if (amount === 0n) return 'Enter Amount';
    return needApprove ? 'Approve' : 'Stake';
  }, [
    isConnected,
    isCorrectChainId,
    isBalanceLoading,
    isAllowanceLoading,
    needApprove,
    isApproving,
    isApproveTransactionConfirming,
    isStakeTransactionConfirming,
    isStaking,
    amount
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
        approve(data.amount);
      } else {
        stake(data.amount);
      }
    },
    [approve, needApprove, stake]
  );

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
        isLoading={
          isApproving || isStaking || isApproveTransactionConfirming || isStakeTransactionConfirming
        }
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
