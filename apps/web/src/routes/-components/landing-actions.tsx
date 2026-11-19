import { Button, buttonVariants } from '@mail-tracker/ui/button';
import { cn } from '@mail-tracker/ui/utils';
import { useEffect, useState } from 'react';

import { detectBrowser, type SupportedBrowser } from '../-utils/browser';

const extensionLinks: Record<SupportedBrowser, { href: string; label: string }> = {
  chrome: {
    href: import.meta.env.VITE_CHROME_EXTENSION_URL ?? '/extension/chrome',
    label: 'Download for Chrome',
  },
  firefox: {
    href: import.meta.env.VITE_FIREFOX_EXTENSION_URL ?? '/extension/firefox',
    label: 'Download for Firefox',
  },
  other: {
    href: import.meta.env.VITE_CHROME_EXTENSION_URL ?? '/extension/chrome',
    label: 'Download browser extension',
  },
};

function LandingActions() {
  const [browser, setBrowser] = useState<SupportedBrowser>('other');
  const extension = extensionLinks[browser];

  useEffect(() => {
    setBrowser(detectBrowser(window.navigator.userAgent));
  }, []);

  return (
    <div className="grid gap-3">
      <Button render={<a href="/api/auth/google">Continue with Google</a>} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
        Continue with Google
      </Button>
      <Button
        render={<a href={extension.href}>{extension.label}</a>}
        className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}
      >
        {extension.label}
      </Button>
    </div>
  );
}

export { LandingActions };
