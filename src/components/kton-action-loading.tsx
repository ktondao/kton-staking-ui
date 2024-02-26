import { Skeleton } from './ui/skeleton';

const KTONActionLoading = () => {
  return (
    <div>
      <Skeleton className="h-[2.5rem] w-full" />
      <Skeleton className="mt-[0.62rem] h-[1rem] w-1/3" />
      <Skeleton className="mt-[1.25rem] h-[2.5rem] w-full" />
    </div>
  );
};

export default KTONActionLoading;
