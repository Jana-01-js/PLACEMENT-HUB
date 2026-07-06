import dotenv from "dotenv";

dotenv.config();

const optional = (key: string, fallback: string) => process.env[key] || fallback;

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: optional("MONGO_URI", ""),
  JWT_ACCESS_SECRET: optional("JWT_ACCESS_SECRET", "local-access-secret"),
  JWT_REFRESH_SECRET: optional("JWT_REFRESH_SECRET", "local-refresh-secret"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || "localhost",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
};
