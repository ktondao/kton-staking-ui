// import { getValueByKey } from '@/hooks/useAppState';
import { useContext } from 'react';

import { AppContext } from '@/providers/app-provider';
export { getOperationStatus } from '@/providers/app-provider';

export const useAppState = () => useContext(AppContext);
