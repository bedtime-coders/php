import { z } from "zod";
import { env } from "@/env";
import { type TokenVariables, token } from "./token.middleware";

export type { TokenVariables };

export const JwtPayload = z.object({
	uid: z.string(),
	email: z.string().email(),
	username: z.string(),
});
export type JwtPayload = z.infer<typeof JwtPayload>;
const JWT_SECRET = env.JWT_SECRET;

/**
 * Auth middleware for Hono, using the hardcoded JwtPayload schema and secret.
 * Usage: app.use(auth())
 */
export function auth() {
	return token({
		secret: JWT_SECRET,
		schema: JwtPayload,
	});
}
