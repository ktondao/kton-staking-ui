"use client";

import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import Button from "@/components/connect-button/button";
import Account from "./account";
import SwitchChain from "./switch-chain";

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  return (
    <div className="flex w-full items-center justify-between space-x-[1.25rem] md:w-auto md:justify-center">
      {openConnectModal ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : null}
      {openChainModal ? <SwitchChain /> : null}
      {openAccountModal ? <Account /> : null}
    </div>
  );
};
export default ConnectButton;
