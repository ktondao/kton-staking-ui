'use client';

import { useAccount } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
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
  const [amount, setAmount] = useState<bigint>(0n);

  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useChain();
  const { refetch: refetchPoolAmount, queryKey: poolAmountQueryKey } = usePoolAmount();

  const {
    isLoading: isBalanceLoading,
    formatted: ktonEtherBalance,
    refetch: refetchBalance,
    queryKey: balanceQueryKey
  } = useBigIntContractQuery({
    contractAddress: activeChain?.ktonToken.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
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
    amount
  });

  const { stake, isStaking, isStakeTransactionConfirming } = useStake({
    ownerAddress: address!,
    onSuccess: () => {
      refetchBalance();
      queryClient.setQueryData(balanceQueryKey, (oldData: bigint) => {
        return (oldData || 0n) - (amount || 0n);
      });
      refetchAllowance();
      queryClient.setQueryData(allowanceQueryKey, (oldData: bigint) => {
        return (oldData || 0n) - (amount || 0n);
      });
      refetchPoolAmount();
      queryClient.setQueryData(poolAmountQueryKey, (oldData: bigint) => {
        return (oldData || 0n) + (amount || 0n);
      });
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
        approve(data.amount);
      } else {
        stake(data.amount);
      }
    },
    [approve, needApprove, stake]
  );

  return (
    <AmountInputForm
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
        className={cn('mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {isAllowanceLoading || isBalanceLoading ? (
          <span className=" animate-pulse"> {buttonText}</span>
        ) : (
          buttonText
        )}
      </Button>
    </AmountInputForm>
  );
};
export default Stake;
