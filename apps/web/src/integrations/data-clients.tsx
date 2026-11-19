import { DbClient, DbProvider } from '@tanstack/react-db';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface DataClients {
  dbClient: DbClient;
  queryClient: QueryClient;
}

export function createDataClients(): DataClients {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
      },
    },
  });
  const dbClient = new DbClient({ queryClient });

  return { dbClient, queryClient };
}

export function DataProvider({ children, clients }: { children: React.ReactNode; clients: DataClients }) {
  return (
    <QueryClientProvider client={clients.queryClient}>
      <DbProvider client={clients.dbClient}>{children}</DbProvider>
    </QueryClientProvider>
  );
}
