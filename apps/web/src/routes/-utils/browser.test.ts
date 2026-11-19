import { expect, test } from 'vitest';

import { detectBrowser } from './browser';

test('detects supported extension browsers', () => {
  expect(detectBrowser('Mozilla/5.0 Firefox/145.0')).toBe('firefox');
  expect(detectBrowser('Mozilla/5.0 Chrome/142.0.0.0 Safari/537.36')).toBe('chrome');
  expect(detectBrowser('Mozilla/5.0 Version/26.0 Safari/605.1.15')).toBe('other');
});
