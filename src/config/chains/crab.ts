import { ChainId, ChainConfig } from '@/types/chains';

export const crab: ChainConfig = {
  id: ChainId.CRAB,
  name: 'Crab',
  nativeCurrency: { name: 'CRAB', symbol: 'CRAB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    },
    public: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Crab Scan',
      url: 'https://crab-scan.darwinia.network/'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 599936
    }
  },
  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/crab.svg',
  daoUrl: 'www.tally.xyz/gov/cktondao',

  /**
   * Token info
   */
  nativeToken: {
    symbol: 'CRAB',
    decimals: 18,
    logoPath: '/images/token/crab.svg'
  },
  ktonToken: {
    address: '0x0000000000000000000000000000000000000402',
    symbol: 'CKTON',
    decimals: 18,
    logoPath: '/images/token/ckton.svg'
  },
  stakingContractAddress: '0xB633Ad1142941CA2Eb9C350579cF88BbE266660D'
} as const satisfies ChainConfig;
