import dynamic from 'next/dynamic';

const Claim = dynamic(() => import('@/components/claim'), { ssr: false });

const ClaimPage = () => {
  return <Claim />;
};
export default ClaimPage;
