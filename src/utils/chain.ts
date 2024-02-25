import { darwinia, crab, pangolin } from '@/config/chains';
import { ChainConfig, ChainId } from '@/types/chains';
import { getItem } from './storage';
import { CHAIN_ID_KEY } from '@/config/baseInfo';

// Cache the chain configurations array
const chainConfigs: ChainConfig[] = [darwinia, crab, pangolin];

// Returns an array of all chain configurations
export function getChainConfigs(): ChainConfig[] {
  return chainConfigs;
}

// Map object to return a specific chain configuration
// Using Record<ChainId, ChainConfig> to ensure type safety
const chainConfigMap: Record<ChainId, ChainConfig> = {
  [ChainId.DARWINIA]: darwinia,
  [ChainId.CRAB]: crab,
  [ChainId.PANGOLIN]: pangolin
};

// Returns the chain configuration for a given chainId, or undefined if the chainId is invalid
export function getChainConfig(chainId: ChainId): ChainConfig | undefined {
  return chainConfigMap[chainId];
}

// Returns the default chain configuration
export function getDefaultChainConfig(): ChainConfig {
  return chainConfigMap[ChainId.DARWINIA];
}

// Returns the chain by its id
export function getChainById(id: ChainId): ChainConfig | undefined {
  return chainConfigs.find((chain) => chain.id === id);
}

// Returns the default chain id with local storage
export function getDefaultChainIdWithLocalStorage(): ChainId {
  const localChainId = getItem(CHAIN_ID_KEY);
  return localChainId ? Number(localChainId) : getDefaultChainConfig().id;
}

// Returns the chain with local storage
export function getDefaultChainWithLocalStorage(): ChainConfig {
  const chainId = getDefaultChainIdWithLocalStorage();
  return getChainConfig(chainId) || getDefaultChainConfig();
}
