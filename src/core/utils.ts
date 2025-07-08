import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env, Schema } from "hono";
import type { EmptyObject } from "type-fest";
import {
	auth,
	type JwtPayload,
	type TokenVariables,
} from "./middleware/auth.middleware";

/**
 * Options for the createApp function.
 */
export type CreateAppOptions = {
	/**
	 * Whether to use authentication middleware.
	 */
	auth?: boolean;
};

/**
 * Create an OpenAPIHono app with optional authentication middleware.
 *
 * @param options - The options for the app. See {@link CreateAppOptions}.
 * @returns The OpenAPIHono app.
 */
export function createApp(
	options: CreateAppOptions,
): OpenAPIHono<{ Variables: TokenVariables<typeof JwtPayload> }>;
export function createApp(
	options?: CreateAppOptions,
): OpenAPIHono<{ Variables: EmptyObject }>;
export function createApp<
	E extends Env = Env,
	S extends Schema = EmptyObject,
	BasePath extends string = "/",
>(options?: CreateAppOptions) {
	const app = new OpenAPIHono<E, S, BasePath>();
	if (options?.auth) {
		app.use("*", auth());
		app.openAPIRegistry.registerComponent("securitySchemes", "Token", {
			type: "apiKey",
			description:
				'Prefix the token with "Token ", e.g. "Token jwt.token.here"',
			in: "header",
			name: "Authorization",
		});
	}
	return app;
}
