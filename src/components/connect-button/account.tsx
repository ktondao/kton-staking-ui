'use client';
import { useRef } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Button from '@/components/ui/ghost-button';
import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import { toShortAddress } from '@/utils';

type AccountProps = {
  address: `0x${string}`;
};
const styles = {
  borderRadius: '50%'
};
const Account = ({ address }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const { disconnectWallet } = useDisconnectWallet();

  const handleCopy = () => {
    copyToClipboard(address);
    toastRef.current = toast('✅ Address successfully copied to clipboard.', {
      duration: 2000
    });
  };
  const handleDisconnect = () => {
    disconnectWallet(address);
  };

  return address ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Jazzicon diameter={24} seed={jsNumberForAddress(address)} svgStyles={styles} />
          <span>{toShortAddress(address)?.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[10rem] gap-[0.625rem] rounded-[0.3125rem] border border-primary p-[0.625rem]">
        <DropdownMenuItem
          title="Click to copy the address to your clipboard"
          className=" cursor-pointer p-[0.625rem] focus:bg-[rgba(94,214,42,.1)] "
          onClick={handleCopy}
        >
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem
          className=" cursor-pointer p-[0.625rem] focus:bg-[rgba(94,214,42,.1)] "
          onClick={handleDisconnect}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
};
export default Account;
