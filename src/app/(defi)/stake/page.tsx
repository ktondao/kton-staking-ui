import dynamic from 'next/dynamic';

const Stake = dynamic(() => import('@/components/stake'), { ssr: false });

const StakePage = () => {
  return <Stake />;
};
export default StakePage;
