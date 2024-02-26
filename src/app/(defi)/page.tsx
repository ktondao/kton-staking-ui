import dynamic from 'next/dynamic';

import KTONActionLoading from '@/components/kton-action-loading';

const Stake = dynamic(() => import('@/components/stake'), {
  ssr: false,
  loading: () => <KTONActionLoading />
});

const DefiPage = () => {
  return <Stake />;
};
export default DefiPage;
