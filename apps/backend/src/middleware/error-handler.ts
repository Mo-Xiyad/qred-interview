import { TRPCError } from '@trpc/server';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof TRPCError) {
    res.status(getHttpStatus(err.code)).json({
      message: err.message,
      code: err.code
    });
    return next();
  }

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
  });
  return next();
};

const getHttpStatus = (code: string): number => {
  const statusMap: Record<string, number> = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TIMEOUT: 408,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  };
  return statusMap[code] || 500;
};
