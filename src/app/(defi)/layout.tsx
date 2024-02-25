import dynamic from 'next/dynamic';

import DefiTabs from '@/components/defi-tabs';

import type { PropsWithChildren } from 'react';

const KTONPool = dynamic(() => import('@/components/kton-pool'), { ssr: false });

const DefiLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-[1.25rem] rounded-[1.25rem] bg-[#242A2E] p-[1.25rem] sm:w-[25rem]">
        <KTONPool />
        <DefiTabs>{children}</DefiTabs>
      </div>
    </div>
  );
};

export default DefiLayout;
