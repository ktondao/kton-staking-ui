import dynamic from 'next/dynamic';

import { PoolProvider } from '@/providers/pool-provider';
import DefiTabs from '@/components/defi-tabs';

import type { PropsWithChildren } from 'react';

const KTONPool = dynamic(() => import('@/components/kton-pool'), { ssr: false });

const DefiLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <PoolProvider>
        <div className="flex w-full flex-col items-center justify-center gap-[1.25rem] rounded-[1.25rem] bg-[#242A2E] p-[1.25rem] sm:w-[25rem]">
          <KTONPool />
          <DefiTabs>{children}</DefiTabs>
        </div>
      </PoolProvider>
    </div>
  );
};

export default DefiLayout;
