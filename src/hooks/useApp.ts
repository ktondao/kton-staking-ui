import { useContext } from 'react';

import { ChainContext } from '@/providers/chain-provider';

export const useApp = () => useContext(ChainContext);
