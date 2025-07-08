import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env, Schema } from "hono";
import type { SignatureKey } from "hono/utils/jwt/jws";
import type { EmptyObject } from "type-fest";
import * as z from "zod";
import { env } from "@/env";
import { type TokenVariables, token } from "./middleware";

// Hardcoded JWT payload schema and secret for now
const JwtPayload = z.object({
	uid: z.string(),
	email: z.string().email(),
	username: z.string(),
});
const JWT_SECRET: SignatureKey = env.JWT_SECRET;

/**
 * Create an OpenAPIHono app with optional authentication middleware.
 *
 * @param options - The options for the app.
 * @returns The OpenAPIHono app.
 */
// Overload signatures for correct type inference
export function createApp(options: {
	auth: true;
}): OpenAPIHono<{ Variables: TokenVariables<typeof JwtPayload> }>;
export function createApp(options?: {
	auth?: false;
}): OpenAPIHono<{ Variables: EmptyObject }>;
export function createApp<
	E extends Env = Env,
	// biome-ignore lint/complexity/noBannedTypes: library default
	S extends Schema = {},
	BasePath extends string = "/",
>(options?: { auth?: boolean }) {
	const app = new OpenAPIHono<E, S, BasePath>();
	if (options?.auth) {
		app.use(
			"*",
			token({
				secret: JWT_SECRET,
				schema: JwtPayload,
			}),
		);
	}
	return app;
}
