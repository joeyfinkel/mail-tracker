import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { DataProvider, createDataClients } from './integrations/data-clients';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const dataClients = createDataClients();
  const router = createTanStackRouter({
    routeTree,
    context: dataClients,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    Wrap: function RouterDataProvider({ children }) {
      return <DataProvider clients={dataClients}>{children}</DataProvider>;
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: dataClients.queryClient,
    wrapQueryClient: false,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
