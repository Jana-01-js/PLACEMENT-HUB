import { Response } from "express";
import { User } from "@models/User.model";
import { ApiError } from "@utils/ApiError";
import { asyncHandler } from "@utils/asyncHandler";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@utils/token";
import { env } from "@config/env";
import { RegisterInput, LoginInput } from "./auth.validation";
import { AuthRequest } from "../types";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  domain: env.NODE_ENV === "production" ? env.COOKIE_DOMAIN : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/auth",
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res: Response) => {
  const { name, email, password, role } = req.body as RegisterInput;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  // Admin accounts should never be self-registered through the public API.
  const safeRole = role === "admin" ? "student" : role || "student";

  const user = await User.create({ name, email, password, role: safeRole });

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated");
  }

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized("Refresh token missing");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Refresh token invalid or expired");
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw ApiError.unauthorized("Refresh token invalid or expired");
  }

  const payload = { userId: user._id.toString(), role: user.role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    data: { accessToken: newAccessToken },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      await User.findByIdAndUpdate(decoded.userId, {
        $unset: { refreshToken: 1 },
      });
    } catch {
      // Token already invalid/expired — nothing to clean up.
    }
  }

  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.status(200).json({
    success: true,
    message: "Current user fetched",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});
