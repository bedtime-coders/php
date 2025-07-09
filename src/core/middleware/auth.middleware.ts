import { env } from "@/core/env";
import { JwtPayload } from "@/shared/schema";
import { type TokenVariables, token } from "./token.middleware";

export type { TokenVariables };
const JWT_SECRET = env.JWT_SECRET;

type AuthMode = "required" | "optional";

/**
 * Auth middleware for Hono, using the hardcoded JwtPayload schema and secret.
 * Usage: app.use(auth())
 */
export function auth(mode: AuthMode = "required") {
	return token({
		secret: JWT_SECRET,
		schema: JwtPayload,
		optional: mode === "optional",
	});
}
