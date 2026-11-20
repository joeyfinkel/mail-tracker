import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { OverviewPage } from '../index';

test('presents the dashboard summary as readable, labeled regions', () => {
  render(<OverviewPage />);

  expect(screen.getByRole('heading', { level: 1, name: 'Your mail at a glance' })).toBeDefined();
  expect(screen.getByRole('region', { name: 'Mail performance' })).toBeDefined();
  expect(screen.getByRole('heading', { name: 'Recent activity' })).toBeDefined();
  expect(screen.getByRole('heading', { name: 'Needs attention' })).toBeDefined();
  expect(screen.getByText('Demo data')).toBeDefined();
});
