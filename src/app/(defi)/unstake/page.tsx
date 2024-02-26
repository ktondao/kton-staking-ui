import dynamic from 'next/dynamic';

import KTONActionLoading from '@/components/kton-action-loading';

const Unstake = dynamic(() => import('@/components/unstake'), {
  ssr: false,
  loading: () => <KTONActionLoading />
});

const UnstakePage = () => {
  return <Unstake />;
};

export default UnstakePage;
