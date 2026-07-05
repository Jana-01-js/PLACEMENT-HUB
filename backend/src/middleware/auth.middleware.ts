import { NextFunction, Response } from "express";
import { ApiError } from "@utils/ApiError";
import { verifyAccessToken } from "@utils/token";
import { AuthRequest } from "../types";
import { Role } from "@constants/roles";

// Verifies the Bearer access token and attaches { userId, role } to req.user
export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Access token missing"));
  }

  const token = header.split(" ")[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Access token invalid or expired"));
  }
};

// Restricts a route to one or more roles. Use after `authenticate`.
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Not authenticated"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You do not have permission to perform this action")
      );
    }
    next();
  };
