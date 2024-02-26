'use client';

import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { menuItems } from '@/config/menu';

const DefiTabs = ({ children }: PropsWithChildren) => {
  const defaultValue = menuItems[0]?.key;
  const pathname = usePathname();
  const value = pathname === '/' ? defaultValue : pathname.replace('/', '');
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
            <Link href={`/${item.key}`}>{item.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator className="my-[1.25rem] bg-white/20" />
      {menuItems.map((item) => (
        <TabsContent value={item.key} key={item.key} className="mt-0">
          <div className="flex flex-col gap-[1.25rem]">{children}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DefiTabs;
