import { queryOptions } from '@tanstack/react-query';

import { sendExtensionRequest } from '@/src/lib/runtime';

export const extensionSessionQuery = queryOptions({
  queryKey: ['extension-session'],
  queryFn: async () => {
    const response = await sendExtensionRequest({ type: 'get-session' });

    if (!response.ok || !('session' in response)) {
      return null;
    }

    return response.session;
  },
});
