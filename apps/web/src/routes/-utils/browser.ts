type SupportedBrowser = 'chrome' | 'firefox' | 'other';

function detectBrowser(userAgent: string): SupportedBrowser {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (normalizedUserAgent.includes('firefox/')) {
    return 'firefox';
  }

  if (normalizedUserAgent.includes('chrome/') || normalizedUserAgent.includes('chromium/') || normalizedUserAgent.includes('edg/')) {
    return 'chrome';
  }

  return 'other';
}

export { detectBrowser, type SupportedBrowser };
