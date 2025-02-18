import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const validateRequest = <T>(schema: z.Schema<T>) => {
  return (input: unknown): T => {
    try {
      return schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.errors.map((e) => e.message).join(', ')
        });
      }
      throw error;
    }
  };
};
