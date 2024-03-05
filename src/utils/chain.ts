import { darwinia, crab, pangolin } from '@/config/chains';
import { ChainConfig, ChainId } from '@/types/chains';
import { CHAIN_ID_KEY } from '@/config/baseInfo';

import { getItem } from './storage';

// Map object to return a specific chain configuration
// Using Record<ChainId, ChainConfig> to ensure type safety
const chainConfigMap: Record<ChainId, ChainConfig> = {
  [ChainId.DARWINIA]: darwinia,
  [ChainId.CRAB]: crab,
  [ChainId.PANGOLIN]: pangolin
};

// Helper function to filter testnets in production
function filterTestnetsInProduction(chains: Record<ChainId, ChainConfig>): ChainConfig[] {
  const chainConfigs = Object.values(chainConfigMap).sort((a, b) => {
    return b.id - a.id;
  });
  // if (process.env.NODE_ENV === 'production') {
  //   return chainConfigs.filter((chain) => !chain.testnet);
  // }
  return chainConfigs;
}

// Returns an array of all chain configurations, filtering out testnets in production
export function getChains(): [ChainConfig, ...ChainConfig[]] {
  const chainConfigs = filterTestnetsInProduction(chainConfigMap);
  if (chainConfigs.length === 0) {
    throw new Error('No chain configurations are available.');
  }
  return [chainConfigs[0], ...chainConfigs.slice(1)] as [ChainConfig, ...ChainConfig[]];
}

// Returns the default chain configuration
export function getDefaultChain(): ChainConfig {
  return chainConfigMap[ChainId.DARWINIA];
}

// Returns the chain by its id
export function getChainById(id: ChainId): ChainConfig | undefined {
  const chainConfig = chainConfigMap[id];
  return chainConfig;
}

// Returns the default chain id with local storage
export function getDefaultChainIdWithLocalStorage(): ChainId {
  const localChainId = getItem(CHAIN_ID_KEY);
  return localChainId ? Number(localChainId) : getDefaultChain().id;
}

// Returns the chain with local storage
export function getDefaultChainWithLocalStorage(): ChainConfig {
  const chainId = getDefaultChainIdWithLocalStorage();
  return getChainById(chainId) || getDefaultChain();
}
