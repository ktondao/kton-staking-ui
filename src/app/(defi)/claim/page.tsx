import dynamic from 'next/dynamic';

import ClaimLoading from '@/components/claim-loading';

const Claim = dynamic(() => import('@/components/claim'), {
  ssr: false,
  loading: () => <ClaimLoading />
});

const ClaimPage = () => {
  return <Claim />;
};
export default ClaimPage;
