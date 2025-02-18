import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../apps/backend/src';

export type { AppRouter };

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
