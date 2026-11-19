import { expect, test } from 'vitest';

import { createDataClients } from './data-clients';

test('creates isolated Query and DB clients for each router instance', () => {
  const first = createDataClients();
  const second = createDataClients();

  expect(first.queryClient).not.toBe(second.queryClient);
  expect(first.dbClient).not.toBe(second.dbClient);
  expect(first.dbClient.requireDependency('queryClient')).toBe(first.queryClient);
});
