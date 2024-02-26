'use client';

import Image from 'next/image';
import { use, useEffect, useMemo, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChainConfig } from '@/types/chains';
import { useApp } from '@/hooks/useApp';
import { getChainById, getChains } from '@/utils/chain';

import Button from './button';

const ChainIconAndName = ({ chain }: { chain: ChainConfig }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <>
        <Image
          src={chain.iconUrl as string}
          width={24}
          height={24}
          loading="eager"
          className="h-[1.5rem] w-[1.5rem] rounded-full"
          alt={chain.name}
        />
        <span className="text-[0.875rem] font-light leading-6">{chain.name}</span>
      </>
    )
  );
};

const SwitchChain = () => {
  const [open, setOpen] = useState(false);
  const chains = getChains();
  const { activeChainId, switchChain } = useApp();

  const activeChain = useMemo(() => getChainById(activeChainId), [activeChainId]);

  return chains?.length && activeChain ? (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button>
          <ChainIconAndName chain={activeChain} />
          <Image
            src="/images/common/arrow-down.svg"
            width={16}
            height={16}
            alt="arrow-down"
            className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[8.5625rem] gap-[0.625rem] rounded-[0.3125rem] border border-primary p-[0.625rem]">
        {chains.map((chain) => (
          <DropdownMenuItem
            onClick={() => switchChain(chain.id)}
            className="flex cursor-pointer items-center gap-[0.31rem] p-[0.625rem] focus:bg-[rgba(94,214,42,.1)]"
            style={{
              backgroundColor: activeChainId === chain.id ? 'rgba(94,214,42,.1)' : ''
            }}
            key={chain.id}
          >
            <ChainIconAndName chain={chain} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
};

export default SwitchChain;
