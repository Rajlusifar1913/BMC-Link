import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "REFRESH_TOKEN_HASH_SECRET",
];

const isProduction = process.env.NODE_ENV === "production";

export const validateEnv = () => {
  const missing = requiredEnv.filter(
    (key) => !process.env[key] || String(process.env[key]).trim() === "",
  );

  if (isProduction && !process.env.CORS_ORIGIN) {
    missing.push("CORS_ORIGIN");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Check Backend/.env or deployment settings.`,
    );
  }

  const generatedPrismaClient = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../generated/prisma/client.js",
  );

  if (!fs.existsSync(generatedPrismaClient)) {
    throw new Error(
      "Prisma client is missing. Run `npm run prisma:generate` before starting the API.",
    );
  }

  return process.env;
};

validateEnv();

export default process.env;
