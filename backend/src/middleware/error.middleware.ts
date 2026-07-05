import { NextFunction, Request, Response } from "express";
import { ApiError } from "@utils/ApiError";
import { env } from "@config/env";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
  } else if ((err as { code?: number }).code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
  }

  if (env.NODE_ENV === "development" && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === "development" && statusCode === 500
      ? { stack: err.stack }
      : {}),
  });
};
