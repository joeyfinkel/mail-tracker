import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';

import type { DataClients } from '../integrations/data-clients';
import { TanStackDevelopmentTools } from '../integrations/development-tools';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<DataClients>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Mail Tracker',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <TanStackDevelopmentTools />

        <Scripts />
      </body>
    </html>
  );
}
