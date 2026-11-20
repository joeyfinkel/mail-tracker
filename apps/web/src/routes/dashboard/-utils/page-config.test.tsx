import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { dashboardPageConfig } from './page-config';

describe('dashboard resource configuration', () => {
  test.each([
    ['activity', 'Activity'],
    ['followUps', 'Follow-ups'],
    ['trackers', 'Trackers'],
    ['settings', 'Settings'],
  ] as const)('dispatches %s through createResourceConfig', (resource, heading) => {
    render(dashboardPageConfig.getComponent({ resource }));

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeDefined();
    expect(screen.getByText('This workspace is ready for live data.')).toBeDefined();
  });
});
