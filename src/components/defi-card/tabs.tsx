import { Tabs as BaseTabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Stake from './stake';
import UnStake from './unstake';
import Claim from './claim';

const tabItems = [
  {
    key: 'stake',
    label: 'Stake'
  },
  {
    key: 'unStake',
    label: 'Unstake'
  },
  {
    key: 'claim',
    label: 'Claim'
  }
] as const;

interface TabsProps {}

const Tabs = ({}: TabsProps) => {
  return (
    <BaseTabs defaultValue={tabItems[0]?.key} className="w-full">
      <TabsList className="flex h-[1.5rem] items-center justify-start gap-[1.25rem] self-stretch bg-transparent ">
        {tabItems.map((item) => (
          <TabsTrigger
            value={item.key}
            key={item.key}
            className="line-clamp-6 bg-transparent p-0 text-[0.875rem] font-bold text-white data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator className="my-[1.25rem] bg-white/20" />
      {tabItems.map((item) => (
        <TabsContent value={item.key} key={item.key} className="mt-0">
          <div className="flex flex-col gap-[1.25rem]">
            {item.key === 'stake' && <Stake />}
            {item.key === 'unStake' && <UnStake />}
            {item.key === 'claim' && <Claim />}
          </div>
        </TabsContent>
      ))}
    </BaseTabs>
  );
};

export default Tabs;
