'use client'
import Image from 'next/image';

import { socialConfig } from '@/config/social';
import { useChain } from '@/hooks/useChain';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  const { activeChain } = useChain();
  return (
    <footer className="flex h-[3.13rem] items-center">
      <div className="max-auto flex w-full items-center justify-center px-8 md:justify-between">
        <span className="text-sm font-light capitalize text-white/50">
          &copy; {currentYear} KtonDAO
        </span>
        {activeChain?.daoUrl &&
          (
            <><div>
            <a href={`https://${activeChain?.daoUrl}`} target="_blank" className='pl-[60px] underline text-[12px]' style={{ color: 'rgba(255,255,255,.5)' }}>{activeChain?.daoUrl}</a>
            </div>
            <div className="pl-[60px] text-[12px]" style={{ color: 'rgba(255,255,255,.5)' }}>
              V1 Migration:{' '}
              <a
                href="https://staking-v1.ktondao.xyz/"
                target="_blank"
                className="underline"
                style={{ color: 'rgba(255,255,255,.5)' }}
              >
                staking-v1.ktondao.xyz
              </a>
            </div></>  
          )
            
        }

        <div className="hidden items-center gap-5 md:flex">
          {socialConfig.map(({ url, name, iconPath }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-80 active:scale-95 active:opacity-60"
            >
              <Image src={iconPath} width={20} height={20} alt={`${name} icon`} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
