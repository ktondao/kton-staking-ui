import dynamic from 'next/dynamic';

import { PoolProvider } from '@/providers/pool-provider';
import KTONPoolLoading from '@/components/kton-pool-loading';

import type { PropsWithChildren } from 'react';

const KTONPool = dynamic(() => import('@/components/kton-pool'), {
  ssr: false,
  loading: () => <KTONPoolLoading />
});

const DefiLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-10 ">
      <PoolProvider>
        <div className="container flex flex-col items-center justify-center gap-5 rounded-[1.25rem] bg-[#242A2E] p-5 sm:w-[25rem]">
          <KTONPool />
          {children}
        </div>
      </PoolProvider>
    </div>
  );
};

export default DefiLayout;
