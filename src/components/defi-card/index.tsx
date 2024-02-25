'use client';

import KTONPool from './kton-pool';
import Tabs from './tabs';

const DefiCard = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[1.25rem] rounded-[1.25rem] bg-[#242A2E] p-[1.25rem] sm:w-[25rem]">
      <KTONPool />
      <Tabs />
    </div>
  );
};

export default DefiCard;
