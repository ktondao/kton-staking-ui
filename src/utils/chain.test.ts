import { describe, expect, it } from 'vitest';

import { ChainId } from '@/types/chains';
import { resolveChainFromWalletChainId } from '@/utils/chain';

describe('resolveChainFromWalletChainId', () => {
  it('falls back to default chain when wallet chainId is undefined', () => {
    expect(resolveChainFromWalletChainId(undefined).id).toBe(ChainId.DARWINIA);
  });

  it('falls back to default chain when wallet chainId is unsupported', () => {
    expect(resolveChainFromWalletChainId(1).id).toBe(ChainId.DARWINIA);
    expect(resolveChainFromWalletChainId(44).id).toBe(ChainId.DARWINIA);
    expect(resolveChainFromWalletChainId(999_999).id).toBe(ChainId.DARWINIA);
  });

  it('resolves to the supported chain when wallet chainId is supported', () => {
    expect(resolveChainFromWalletChainId(ChainId.DARWINIA).id).toBe(ChainId.DARWINIA);
  });
});

