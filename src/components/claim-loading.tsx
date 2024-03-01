import { Skeleton } from './ui/skeleton';

const ClaimLoading = () => {
  return (
    <div className="flex flex-col gap-[1.25rem]">
      <Skeleton className="h-[4.5rem] w-full rounded-[0.3125rem]"></Skeleton>
      <Skeleton className="h-[2.5rem] w-full rounded-[0.3125rem]"></Skeleton>
    </div>
  );
};
export default ClaimLoading;
