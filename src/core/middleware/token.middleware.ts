/**
 * @module
 * JWT Auth Middleware for Hono.
 */

import type { Context } from "hono";
import { getCookie, getSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import type { MiddlewareHandler } from "hono/types";
import type { CookiePrefixOptions } from "hono/utils/cookie";
import { Jwt } from "hono/utils/jwt";
import type { SignatureAlgorithm } from "hono/utils/jwt/jwa";
import type { SignatureKey } from "hono/utils/jwt/jws";
import type { ZodSchema, z } from "zod";
import { StatusCodes } from "@/shared/constants";

export type TokenVariables<Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
	jwtPayload: z.infer<Schema>;
};

/**
 * JWT Auth Middleware for Hono.
 *
 * @see {@link https://hono.dev/docs/middleware/builtin/jwt}
 *
 * @param {object} options - The options for the JWT middleware.
 * @param {SignatureKey} [options.secret] - A value of your secret key.
 * @param {string} [options.cookie] - If this value is set, then the value is retrieved from the cookie header using that value as a key, which is then validated as a token.
 * @param {SignatureAlgorithm} [options.alg=HS256] - An algorithm type that is used for verifying. Available types are `HS256` | `HS384` | `HS512` | `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA`.
 * @param {string} [options.headerName='Authorization'] - The name of the header to look for the JWT token. Default is 'Authorization'.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(
 *   '/auth/*',
 *   jwt({
 *     secret: 'it-is-very-secret',
 *     headerName: 'x-custom-auth-header', // Optional, default is 'Authorization'
 *   })
 * )
 *
 * app.get('/auth/page', (c) => {
 *   return c.text('You are authorized')
 * })
 * ```
 */
export const token = <T = unknown>(options: {
	secret: SignatureKey;
	schema?: ZodSchema<T>;
	cookie?:
		| string
		| {
				key: string;
				secret?: string | BufferSource;
				prefixOptions?: CookiePrefixOptions;
		  };
	alg?: SignatureAlgorithm;
	headerName?: string;
}): MiddlewareHandler => {
	if (!options || !options.secret) {
		throw new Error('JWT auth middleware requires options for "secret"');
	}

	if (!crypto.subtle || !crypto.subtle.importKey) {
		throw new Error(
			"`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.",
		);
	}

	return async function jwt(ctx, next) {
		const headerName = options.headerName || "Authorization";

		const credentials = ctx.req.raw.headers.get(headerName);
		let token: string | undefined;
		if (credentials) {
			const parts = credentials.split(/\s+/);
			if (parts.length !== 2) {
				const errDescription = "invalid credentials structure";
				throw new HTTPException(StatusCodes.UNAUTHORIZED, {
					message: errDescription,
					res: unauthorizedResponse({
						ctx,
						error: "invalid_request",
						errDescription,
					}),
				});
			}
			token = parts[1];
		} else if (options.cookie) {
			if (typeof options.cookie === "string") {
				token = getCookie(ctx, options.cookie);
			} else if (options.cookie.secret) {
				if (options.cookie.prefixOptions) {
					token =
						(await getSignedCookie(
							ctx,
							options.cookie.secret,
							options.cookie.key,
							options.cookie.prefixOptions,
						)) || undefined;
				} else {
					token =
						(await getSignedCookie(
							ctx,
							options.cookie.secret,
							options.cookie.key,
						)) || undefined;
				}
			} else {
				if (options.cookie.prefixOptions) {
					token = getCookie(
						ctx,
						options.cookie.key,
						options.cookie.prefixOptions,
					);
				} else {
					token = getCookie(ctx, options.cookie.key);
				}
			}
		}

		if (!token) {
			const errDescription = "no authorization included in request";
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: errDescription,
				res: unauthorizedResponse({
					ctx,
					error: "invalid_request",
					errDescription,
				}),
			});
		}

		let payload: unknown;
		let cause: unknown;
		try {
			payload = await Jwt.verify(token, options.secret, options.alg);
		} catch (e) {
			cause = e;
		}
		if (!payload) {
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: "Unauthorized",
				res: unauthorizedResponse({
					ctx,
					error: "invalid_token",
					statusText: "Unauthorized",
					errDescription: "token verification failure",
				}),
				cause,
			});
		}

		// --- Zod validation here ---
		if (options.schema) {
			const result = options.schema.safeParse(payload);
			if (!result.success) {
				throw new HTTPException(StatusCodes.UNAUTHORIZED, {
					message: "Invalid JWT payload",
					res: unauthorizedResponse({
						ctx,
						error: "invalid_token",
						errDescription: "JWT payload validation failed",
					}),
				});
			}
			ctx.set("jwtPayload", result.data);
		} else {
			ctx.set("jwtPayload", payload);
		}

		await next();
	};
};

function unauthorizedResponse(opts: {
	ctx: Context;
	error: string;
	errDescription: string;
	statusText?: string;
}) {
	return new Response("Unauthorized", {
		status: StatusCodes.UNAUTHORIZED,
		statusText: opts.statusText,
		headers: {
			"WWW-Authenticate": `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`,
		},
	});
}

export const verify = Jwt.verify;
export const decode = Jwt.decode;
export const sign = Jwt.sign;
