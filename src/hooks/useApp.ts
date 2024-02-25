import { ChainContext } from '@/providers/chain-provider';
import { useContext } from 'react';

export const useApp = () => useContext(ChainContext);
