import { ChainConfig, ChainId } from "@/types/chains";

export const koi: ChainConfig = {
    id: ChainId.KOI,
    name: 'Koi',
    nativeCurrency: { name: 'KRING', symbol: 'KRING', decimals: 18 },
    rpcUrls: {
        default: {
          http: ['https://koi-rpc.darwinia.network'],
          webSocket: ['wss://koi-rpc.darwinia.network']
        },
        public: {
          http: ['https://koi-rpc.darwinia.network'],
          webSocket: ['wss://koi-rpc.darwinia.network']
        }
    },
    blockExplorers: {
        default: {
          name: 'Koi Scan',
          url: 'https://koi-scan.darwinia.network/'
        }
    },
    iconUrl: '/images/chains/koi.png',

    /**
     * Token info
     */
    nativeToken: {
        symbol: 'KRING',
        decimals: 18,
        logoPath: '/images/token/ring.svg'
    },
    ktonToken: {
        address: '0x0000000000000000000000000000000000000402',
        symbol: 'PKTON',
        decimals: 18,
        logoPath: '/images/token/pkton.svg'
    },
    stakingContractAddress: '0xB633Ad1142941CA2Eb9C350579cF88BbE266660D'
} as const satisfies ChainConfig;