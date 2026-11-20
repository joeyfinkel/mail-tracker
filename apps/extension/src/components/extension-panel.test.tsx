import { render, screen } from '@testing-library/react';
import { createAgent } from '@ui-sdk/react/agent';
import { beforeEach, expect, test, vi } from 'vitest';

import { ExtensionQueryProvider } from '@/src/providers/query';
import { ExtensionPanel } from './extension-panel';

const agent = createAgent();
const { sendExtensionRequest } = vi.hoisted(() => ({
  sendExtensionRequest: vi.fn(),
}));

vi.mock('@/src/lib/runtime', () => ({
  sendExtensionRequest,
}));

beforeEach(() => {
  sendExtensionRequest.mockResolvedValue({
    ok: true,
    session: { accountEmail: 'person@example.com' },
  });
});

test('loads the extension session through Query and exposes its action to agents', async () => {
  render(
    <ExtensionQueryProvider>
      <ExtensionPanel />
    </ExtensionQueryProvider>,
  );

  expect(await screen.findByText('person@example.com')).toBeDefined();
  expect(screen.getByText('Connected')).toBeDefined();
  expect(sendExtensionRequest).toHaveBeenCalledWith({ type: 'get-session' });

  const labels = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== 'more')
    .map((entry) => entry.label);

  expect(labels).toContain('Open dashboard');
});
