import dynamic from 'next/dynamic';

const Stake = dynamic(() => import('@/components/stake'), { ssr: false });

const DefiPage = () => {
  return <Stake />;
};
export default DefiPage;
