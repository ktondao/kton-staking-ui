import * as React from 'react';
import { ExternalLink } from 'lucide-react';

export const RINGDAO_REWARDS_PROPOSAL_URL =
  'https://gov.ringdao.com/proposal/0xf26faca1125af8f9813c5d88fecf533aa11d5a1b4f9b6dcd131c90206156dd1d';

const ClaimRewardsNotice = () => {
  return (
    <aside
      aria-labelledby="claim-rewards-notice-title"
      className="rounded-[0.3125rem] border border-l-2 border-white/10 border-l-primary bg-[#1A1D1F]/70 px-3.5 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="claim-rewards-notice-title"
          className="text-[0.625rem] font-bold leading-4 tracking-[0.08em] text-primary"
        >
          REWARD UPDATE
        </h2>
        <a
          href={RINGDAO_REWARDS_PROPOSAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the RingDAO governance proposal about KTON staking rewards (opens in a new tab)"
          className="inline-flex shrink-0 items-center gap-1 text-[0.625rem] font-bold leading-4 text-white/60 underline decoration-white/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          VIEW PROPOSAL
          <ExternalLink aria-hidden="true" className="size-3" strokeWidth={2} />
        </a>
      </div>
      <p className="mt-2 text-[0.6875rem] leading-[1.125rem]">
        <span className="font-bold text-white">
          KTON staking will no longer earn new RING rewards.
        </span>{' '}
        <span className="text-white/60">Claim remains available for rewards already earned.</span>
      </p>
    </aside>
  );
};

export default ClaimRewardsNotice;
