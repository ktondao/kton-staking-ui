import { useContext } from 'react';
import { PoolContext } from '@/providers/pool-provider';

export const usePoolAmount = () => useContext(PoolContext);
