import { env } from '#/config/env.js';
import { AppError } from '#/shared/errors/AppError.js';
import { Request, Response, NextFunction } from 'express';


export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // unexpected error — not one we deliberately threw via AppError.
  // Log the full thing for debugging, but never leak internals to the client.
  console.error('Unexpected error:', err);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};