import { ChainId, ChainConfig } from '@/types/chains';

export const darwinia: ChainConfig = {
  id: ChainId.DARWINIA,
  name: 'Darwinia',
  nativeCurrency: {
    name: 'RING',
    symbol: 'RING',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.darwinia.network'],
      webSocket: ['wss://rpc.darwinia.network']
    },
    public: {
      http: ['https://rpc.darwinia.network'],
      webSocket: ['wss://rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://darwinia.subscan.io/'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 251739
    }
  },

  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/darwinia.png',
  daoUrl: 'www.tally.xyz/gov/ktondao',

  /**
   * Token info
   */
  nativeToken: {
    symbol: 'RING',
    decimals: 18,
    logoPath: '/images/token/ring.svg'
  },
  ktonToken: {
    address: '0x0000000000000000000000000000000000000402',
    symbol: 'KTON',
    decimals: 18,
    logoPath: '/images/token/kton.svg'
  },
  stakingContractAddress: '0xB633Ad1142941CA2Eb9C350579cF88BbE266660D'
} as const satisfies ChainConfig;
