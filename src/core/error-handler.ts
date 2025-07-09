import { Prisma } from "@prisma/client";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { match, P } from "ts-pattern";
import { NORMAL_ERROR_CODES, StatusCodes } from "@/shared/constants";
import {
	ApiError,
	ConflictingFieldsError,
	getDbError,
	RealWorldError,
} from "@/shared/errors";
import { SelfFollowError } from "@/users/errors/self-follow.error";

function parseWwwAuthenticate(header: string) {
	const errorMatch = header.match(/error="([^"]+)"/);
	const descMatch = header.match(/error_description="([^"]+)"/);
	return {
		error: errorMatch ? errorMatch[1] : "unknown",
		description: descMatch ? descMatch[1] : "An error occurred",
	};
}

export const errorHandler = async (err: Error, c: Context) => {
	const result = await match(err)
		.with(P.instanceOf(ApiError), (err) => ({
			status: err.status,
			logInfo: err,
			response: c.json(
				{ errors: err.errors },
				err.status as ContentfulStatusCode,
			),
		}))
		.with(P.instanceOf(HTTPException), async (err) => {
			const res = err.getResponse();
			const resClone = res.clone();
			const contentType = resClone.headers.get("content-type") || "";
			const wwwAuth = resClone.headers.get("WWW-Authenticate");

			if (wwwAuth) {
				const { error, description } = parseWwwAuthenticate(wwwAuth);
				return {
					status: res.status,
					logInfo: { error, description, status: res.status },
					response: c.json(
						{
							errors: { [error]: [description] },
						},
						res.status as ContentfulStatusCode,
					),
				};
			}

			if (contentType.includes("application/json")) {
				const body = await resClone.json();
				return { status: res.status, logInfo: body, response: res };
			}

			const text = await resClone.text();
			return { status: res.status, logInfo: text, response: res };
		})
		.with(P.instanceOf(Prisma.PrismaClientKnownRequestError), (err) => {
			const dbError = getDbError(err);
			return {
				status: dbError.status,
				logInfo: err,
				response: c.json(
					dbError.object,
					dbError.status as ContentfulStatusCode,
				),
			};
		})
		.with(P.instanceOf(ConflictingFieldsError), (err) => ({
			status: StatusCodes.CONFLICT,
			logInfo: err,
			response: c.json(
				{
					errors: err.errors,
				},
				StatusCodes.CONFLICT as ContentfulStatusCode,
			),
		}))
		.with(P.instanceOf(SelfFollowError), (err) => ({
			status: StatusCodes.UNPROCESSABLE_CONTENT,
			logInfo: err,
			response: c.json(
				{ errors: err.errors },
				StatusCodes.UNPROCESSABLE_CONTENT as ContentfulStatusCode,
			),
		}))
		.with(P.instanceOf(RealWorldError), (err) => ({
			status: StatusCodes.BAD_REQUEST,
			logInfo: err,
			response: c.json(
				{ errors: err.errors },
				StatusCodes.BAD_REQUEST as ContentfulStatusCode,
			),
		}))
		.otherwise(() => ({
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			logInfo: err,
			response: c.json(
				{
					errors: { unknown: ["an error occurred"] },
				},
				StatusCodes.INTERNAL_SERVER_ERROR as ContentfulStatusCode,
			),
		}));

	if (!NORMAL_ERROR_CODES.includes(result.status)) {
		console.error(result.logInfo);
	}

	return result.response;
};
