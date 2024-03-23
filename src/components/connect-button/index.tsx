'use client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import Button from '@/components/ui/ghost-button';

import Account from './account';
import SwitchChain from './switch-chain';

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();

  return (
    <div className="flex w-full items-center justify-between space-x-[1.25rem] md:w-auto md:justify-center">
      {!isConnected && openConnectModal ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : null}
      {isConnected && address ? <SwitchChain /> : null}
      {isConnected && address ? <Account address={address} /> : null}
    </div>
  );
};
export default ConnectButton;
