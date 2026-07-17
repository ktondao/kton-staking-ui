import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ClaimRewardsNotice, { KTONDAO_REWARDS_PROPOSAL_URL } from './claim-rewards-notice';

describe('ClaimRewardsNotice', () => {
  it('explains the reward phase-out without hiding access to accrued rewards', () => {
    const markup = renderToStaticMarkup(createElement(ClaimRewardsNotice));

    expect(markup).toContain('KTON staking will no longer earn new RING rewards.');
    expect(markup).toContain('Claim remains available for rewards already earned.');
    expect(KTONDAO_REWARDS_PROPOSAL_URL).toBe(
      'https://gov.ktondao.xyz/proposal/0xb20b4feabca368f82aa819edce05e65a20d8ebbd998f0681143bbe6958052469'
    );
    expect(markup).toContain(`href="${KTONDAO_REWARDS_PROPOSAL_URL}"`);
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-labelledby="claim-rewards-notice-title"');
  });
});
