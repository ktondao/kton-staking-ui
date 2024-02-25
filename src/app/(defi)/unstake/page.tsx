import dynamic from 'next/dynamic';

const Unstake = dynamic(() => import('@/components/unstake'), { ssr: false });

const UnstakePage = () => {
  return <Unstake />;
};

export default UnstakePage;
