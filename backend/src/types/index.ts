import { Request } from "express";
import { Role } from "@constants/roles";

export interface JwtPayload {
  userId: string;
  role: Role;
}

// Extends Express's Request so controllers/middleware get typed `req.user`
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}
