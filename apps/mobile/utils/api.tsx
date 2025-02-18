import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';

import type { AppRouter } from '@qred/api';
import { getBaseUrl } from './trpc';

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from '@qred/api';

export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 5000
          }
        }
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer: superjson,
          headers: () => {
            return {
              'Content-Type': 'application/json'
            };
          }
        })
      ]
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
