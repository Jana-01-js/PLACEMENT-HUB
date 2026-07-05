import app from "./app";
import { env } from "@config/env";
import { connectDB } from "@config/db";

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(
      `[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`
    );
  });

  process.on("unhandledRejection", (reason) => {
    console.error("[Server] Unhandled rejection:", reason);
    server.close(() => process.exit(1));
  });

  process.on("SIGTERM", () => {
    console.log("[Server] SIGTERM received, shutting down gracefully");
    server.close(() => process.exit(0));
  });
};

startServer();
