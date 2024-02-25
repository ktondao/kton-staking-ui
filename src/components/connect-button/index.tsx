'use client';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from '@/components/connect-button/button';
import Account from './account';
import SwitchChain from './switch-chain';
import { useAccount } from 'wagmi';

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex w-full items-center justify-between space-x-[1.25rem] md:w-auto md:justify-center">
      {!isConnected && openConnectModal ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : null}
      {isConnected ? <SwitchChain /> : null}
      {address ? <Account /> : null}
    </div>
  );
};
export default ConnectButton;
