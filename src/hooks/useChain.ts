import { useContext } from 'react';

import { ChainContext } from '@/providers/chain-provider';

export const useChain = () => useContext(ChainContext);
