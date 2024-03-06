import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center px-10 ">
      <Skeleton className="container flex h-[26.5rem] flex-col items-center justify-center gap-5 rounded-[1.25rem] bg-[#242A2E] p-5 sm:w-[25rem]"></Skeleton>
    </div>
  );
};
export default Loading;
