import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "@/env";

export const db = drizzle(env.DATABASE_URL);
