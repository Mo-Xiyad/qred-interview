import * as trpc from '@trpc/server';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

const t = initTRPC.create();

export const router = t.router;
const appRouter = router({
  getUser: t.procedure.input(z.number()).query(async ({ input }) => {
    return {
      id: input,
      name: 'John Doe'
    };
  })
});

const createContext = ({
  req,
  res
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

const config = {
  port: process.env.PORT || 4000
};

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TRPC routes
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
);

app.listen(config.port as number, '0.0.0.0', () => {
  console.log(`📍 Backend http://localhost:${config.port}`);
});
