import { PrismaClient } from '@prisma/client';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { config } from './config/env';
import { RouterFactory } from './factories/router.factory';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import { rateLimiter } from './middleware/rate-limiter';
import healthRouter from './routers/health';

const prisma = new PrismaClient();
const appRouter = RouterFactory.create(prisma);

const app = express();

// Security middleware
app.use(
  cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging and rate limiting
app.use(requestLogger);
app.use(rateLimiter);

app.use('/health', healthRouter);

// TRPC routes
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    // TODO: add user to context
    onError: ({ error }) => {
      console.error('TRPC error:', error);
      return {
        message: error.message,
        code: 'INTERNAL_SERVER_ERROR'
      };
    }
  })
);

app.use(errorHandler as ErrorRequestHandler);

app.listen(config.port as number, '0.0.0.0', () => {
  console.log(`📍 Backned http://localhost:${config.port}`);
});

export type { AppRouter } from './routers';
