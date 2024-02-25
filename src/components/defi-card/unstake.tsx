'use client';
import { useApp } from '@/hooks/useApp';
import KTONAction from './kton-action';

const Unstake = () => {
  const { isCorrectChainId } = useApp();

  return (
    <KTONAction
      key={'unstake'}
      onSubmit={(data) => {
        console.log('data', data);
      }}
      submitText="Unstake"
      disabled={!isCorrectChainId}
    />
  );
};
export default Unstake;
