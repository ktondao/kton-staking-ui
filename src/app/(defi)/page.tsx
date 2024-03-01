'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { menuItems } from '@/config/menu';
import KTONActionLoading from '@/components/kton-action-loading';
import ClaimLoading from '@/components/claim-loading';
import { cn } from '@/lib/utils';

// 动态导入组件，禁用SSR
const Stake = dynamic(() => import('@/components/stake'), {
  ssr: false,
  loading: () => <KTONActionLoading />
});

const UnStakes = dynamic(() => import('@/components/unstake'), {
  ssr: false,
  loading: () => <KTONActionLoading />
});

const Claim = dynamic(() => import('@/components/claim'), {
  ssr: false,
  loading: () => <ClaimLoading />
});

const transactionActiveClassName = 'opacity-50 cursor-default pointer-events-none';
const defaultValue = menuItems[0]?.key;

const DefiTabs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isTransactionActive, setIsTransactionActive] = useState(false);

  const value = searchParams.get('type') || defaultValue;

  return (
    <Tabs defaultValue={defaultValue} className="w-full" value={value}>
      <TabsList className="flex h-[1.5rem] items-center justify-start gap-[1.25rem] self-stretch bg-transparent ">
        {menuItems.map((item) => (
          <TabsTrigger
            asChild
            value={item.key}
            key={item.key}
            className="line-clamp-6 bg-transparent p-0 text-[0.875rem] font-bold text-white data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <span
              className={cn(
                'cursor-pointer',
                isTransactionActive ? transactionActiveClassName : ''
              )}
              onClick={() => {
                router.push(`${pathname}?type=${item.key}`);
              }}
            >
              {item.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator className="my-[1.25rem] bg-white/20" />
      <AnimatePresence>
        {menuItems.map(
          (item) =>
            value === item.key && (
              <TabsContent key={item.key} value={item.key} className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-[1.25rem]"
                >
                  {value === 'stake' && (
                    <Stake onTransactionActiveChange={setIsTransactionActive} />
                  )}
                  {value === 'unstake' && (
                    <UnStakes onTransactionActiveChange={setIsTransactionActive} />
                  )}
                  {value === 'claim' && (
                    <Claim onTransactionActiveChange={setIsTransactionActive} />
                  )}
                </motion.div>
              </TabsContent>
            )
        )}
      </AnimatePresence>
    </Tabs>
  );
};

export default DefiTabs;
