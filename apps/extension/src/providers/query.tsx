import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ExtensionQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createExtensionQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function createExtensionQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
      },
    },
  });
}
