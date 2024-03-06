import Image from 'next/image';
import Link from 'next/link';

import ConnectButton from '@/components/connect-button';

const Header = () => {
  return (
    <header className="h-12 w-full md:h-[3.5rem]">
      <div className="mx-auto flex h-full w-full items-center justify-between px-8">
        <Link href="/" title="darwinia" className="hidden md:inline ">
          <Image
            src={'/images/common/logo.png'}
            alt="darwinia logo"
            priority
            width={154}
            height={18}
            className="h-[18px] w-[154px] shrink-0"
          />
        </Link>
        <ConnectButton />
      </div>
    </header>
  );
};
export default Header;
