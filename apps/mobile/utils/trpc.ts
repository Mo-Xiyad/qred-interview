import type { AppRouter } from '@qred/api';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export const getBaseUrl = () => {
  return `http://0.0.0.0:4001`;
};
