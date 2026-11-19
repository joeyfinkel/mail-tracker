import { render } from '@testing-library/react';
import { createAgent } from '@ui-sdk/react/agent';
import { expect, test } from 'vitest';

import { LandingActions } from './landing-actions';

const agent = createAgent();

test('exposes the landing page actions to agents', () => {
  render(<LandingActions />);

  const labels = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== 'more')
    .map((entry) => entry.label);

  expect(labels).toContain('Continue with Google');
  expect(labels).toContain('Download browser extension');
});
