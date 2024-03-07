'use client';
import { useRef } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';

import Button from '@/components/ui/ghost-button';
import { toShortAddress } from '@/utils';

type AccountProps = {
  address: string;
};
const styles = {
  borderRadius: '50%'
};
const Account = ({ address }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(address);
    toastRef.current = toast('✅ Address successfully copied to clipboard.', {
      duration: 2000
    });
  };

  return address ? (
    <Button title="Click to copy the address to your clipboard" onClick={handleCopy}>
      <Jazzicon diameter={24} seed={jsNumberForAddress(address)} svgStyles={styles} />
      <span>{toShortAddress(address)?.toUpperCase()}</span>
    </Button>
  ) : null;
};
export default Account;
