import { useContext } from 'react';

import { AppContext } from '@/providers/app-provider';
export { getOperationStatus } from '@/providers/app-provider';

export const useAppState = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }

  return context;
};
