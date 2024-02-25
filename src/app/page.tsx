import { ConnectButton } from '@rainbow-me/rainbowkit';
import DefiCard from '@/components/defi-card';

export default function Home() {
  return (
    <div className="container m-auto flex h-full w-full flex-col items-center justify-center">
      <DefiCard />
    </div>
  );
}
