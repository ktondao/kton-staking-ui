import { useContext } from 'react';

import { PoolContext } from '@/providers/pool-provider';

export const usePoolAmount = () => {
  const context = useContext(PoolContext);

  // 如果context为undefined，说明PoolContext.Provider没有在父级正确提供
  if (context === undefined) {
    throw new Error('usePoolAmount must be used within a PoolProvider');
  }

  return context;
};
