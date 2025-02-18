import { initTRPC } from '@trpc/server';
import { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import superjson from 'superjson';

export const t = initTRPC.create({
  transformer: superjson,
  errorFormatter: ({ shape }: { shape: DefaultErrorShape }) => ({
    ...shape,
    data: {
      ...shape.data,
      timestamp: new Date().toISOString()
    }
  })
});

export const router = t.router;
export const publicProcedure = t.procedure;

// TODO: add protected procedure this will be used to check if the user is authenticated and has the necessary permissions
