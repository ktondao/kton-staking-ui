'use client';
import { useApp } from '@/hooks/useApp';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useCall
} from 'wagmi';
import KTONAction from './kton-action';
import { abi } from '@/config/abi/KTONStakingRewards';
import { Button } from '@/components/ui/button';
import { erc20Abi, parseEther } from 'viem';
import { useTokenAllowanceAndApprove } from '@/hooks/useTokenAllowanceAndApprove';
import { cn } from '@/lib/utils';
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { useBigIntContractQuery } from '@/hooks/useBigIntContractQuery';
import { useStake } from '@/hooks/useStake';
import KTONBalance from './kton-balance';

import type { Form, SubmitData } from './kton-action';

interface StakeProps {}
const Stake = ({}: StakeProps) => {
  const formRef: MutableRefObject<Form | null> = useRef(null);
  const [amount, setAmount] = useState<bigint>(0n);
  const { address, isConnected } = useAccount();
  const { activeChain, isCorrectChainId } = useApp();

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

  const {
    isAllowanceLoading,
    allowance,
    approve,
    isApproving,
    approveData,
    isApproveSuccess,
    isApproveError,
    approveFailureReason
  } = useTokenAllowanceAndApprove({
    tokenAddress: activeChain?.ktonToken.address,
    ownerAddress: address!,
    spenderAddress: activeChain?.stakingContractAddress
  });

  const { stake, isStaking, stakeData } = useStake({
    contractAddress: activeChain?.stakingContractAddress,
    ownerAddress: address!
  });

  const result = useWaitForTransactionReceipt({
    hash: stakeData
  });

  console.log('result', result);

  const needApprove = !allowance || allowance < amount;

  console.log('isAllowanceLoading', isAllowanceLoading);
  console.log('allowance', allowance);
  console.log('isApproving', isApproving);
  console.log('approveData', approveData);
  console.log('isApproveSuccess', isApproveSuccess);
  console.log('approveError', isApproveError);
  console.log('approveFailureReason', approveFailureReason);
  console.log('needApprove', needApprove);

  // const { data: balanceData, isFetching: isBalanceFetching } = useReadContract({
  //   abi,
  //   account: address,
  //   address: activeChain?.stakingContractAddress,
  //   functionName: 'balanceOf',
  //   args: [address!]
  // });

  // const { data: earnedData, isFetching: isEarnedFetching } = useReadContract({
  //   abi,
  //   account: address,
  //   address: activeChain?.stakingContractAddress,
  //   functionName: 'earned',
  //   args: [address!]
  // });

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
        stake(data.amount)
          ?.then((res) => {
            console.log('stake', res);
          })
          ?.catch((err) => {
            console.log('stake err', err);
          })
          ?.finally(() => {
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
    if (isAllowanceLoading) {
      return 'Checking Allowance';
    }
    if (needApprove) {
      return 'Approve';
    }
    if (isApproving) {
      return 'Approving';
    }
    if (isStaking) {
      return 'Staking';
    }
    return 'Stake';
  }, [isConnected, isCorrectChainId, isAllowanceLoading, needApprove, isApproving, isStaking]);

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
        disabled={isAllowanceLoading || !isConnected || !isCorrectChainId || !amount}
        type="submit"
        isLoading={isApproving || isStaking}
        className={cn('mt-[1.25rem] w-full rounded-[0.3125rem] text-[0.875rem] text-white')}
      >
        {buttonText}
      </Button>
    </KTONAction>
  );
};
export default Stake;
