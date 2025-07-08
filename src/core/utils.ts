import { OpenAPIHono, type OpenAPIHonoOptions } from "@hono/zod-openapi";
import type { Env, Hono, Schema, ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import type { EmptyObject } from "type-fest";
import type { ZodError } from "zod";
import { StatusCodes } from "@/shared/constants";
import {
	auth,
	type JwtPayload,
	type TokenVariables,
} from "./middleware/auth.middleware";

export function formatZodErrors(
	result: { target: keyof ValidationTargets } & {
		success: false;
		error: ZodError;
	},
): { path: string; message: string }[] {
	return result.error.errors.map((error) => ({
		path: error.path.join("."),
		message: error.message,
	}));
}

type HonoInit<E extends Env> = ConstructorParameters<typeof Hono>[0] &
	OpenAPIHonoOptions<E>;

/**
 * Options for the createApp function.
 */
export type CreateAppOptions<E extends Env = Env> = {
	/**
	 * Whether to use authentication middleware.
	 */
	auth?: boolean;

	/**
	 * The initial options for the Hono app. (This is what you pass in `new Hono(...)` or `new OpenAPIHono(...)`)
	 */
	init?: HonoInit<E>;
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
>(options?: CreateAppOptions<E>) {
	const app = new OpenAPIHono<E, S, BasePath>({
		defaultHook: (result, { json }) => {
			if (result.success) return;
			throw new HTTPException(StatusCodes.UNPROCESSABLE_ENTITY, {
				cause: result.error,
				res: json({
					errors: formatZodErrors(result),
				}),
			});
		},
		...options?.init,
	});
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
