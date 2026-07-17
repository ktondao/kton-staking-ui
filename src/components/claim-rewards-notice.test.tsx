import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ClaimRewardsNotice, { RINGDAO_REWARDS_PROPOSAL_URL } from './claim-rewards-notice';

describe('ClaimRewardsNotice', () => {
  it('explains the reward phase-out without hiding access to accrued rewards', () => {
    const markup = renderToStaticMarkup(createElement(ClaimRewardsNotice));

    expect(markup).toContain('KTON staking will no longer earn new RING rewards.');
    expect(markup).toContain('Claim remains available for rewards already earned.');
    expect(markup).toContain(`href="${RINGDAO_REWARDS_PROPOSAL_URL}"`);
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-labelledby="claim-rewards-notice-title"');
  });
});
