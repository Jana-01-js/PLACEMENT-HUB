import { NextFunction, Request, Response } from "express";

// Strips characters commonly used in stored/reflected XSS payloads from
// user-supplied strings. This is a lightweight defense-in-depth layer —
// output encoding on the frontend remains the primary protection.
const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replace(/<script.*?>.*?<\/script>/gi, "").replace(/[<>]/g, "");
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeValue(val);
    }
    return result;
  }
  return value;
};

export const sanitizeRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params) as typeof req.params;
  next();
};
