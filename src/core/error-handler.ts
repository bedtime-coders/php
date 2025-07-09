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

const createErrorResponse = (
	c: Context,
	status: number,
	errOrErrors: Record<string, string[]> | { errors: Record<string, string[]> },
) => ({
	status,
	logInfo: errOrErrors,
	response: c.json(
		typeof errOrErrors === "object" && "errors" in errOrErrors
			? { errors: errOrErrors.errors }
			: { errors: errOrErrors },
		status as ContentfulStatusCode,
	),
});

export const errorHandler = async (err: Error, c: Context) => {
	const result = await match(err)
		.with(P.instanceOf(ApiError), (err) =>
			createErrorResponse(c, err.status, err.errors),
		)
		.with(P.instanceOf(HTTPException), async (err) => {
			const res = err.getResponse();
			const resClone = res.clone();
			const contentType = resClone.headers.get("content-type") || "";
			const wwwAuth = resClone.headers.get("WWW-Authenticate");

			if (wwwAuth) {
				const { error, description } = parseWwwAuthenticate(wwwAuth);
				return createErrorResponse(c, res.status, { [error]: [description] });
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
		.with(P.instanceOf(ConflictingFieldsError), (err) =>
			createErrorResponse(c, StatusCodes.CONFLICT, err),
		)
		.with(P.instanceOf(SelfFollowError), (err) =>
			createErrorResponse(c, StatusCodes.UNPROCESSABLE_CONTENT, err),
		)
		.with(P.instanceOf(RealWorldError), (err) =>
			createErrorResponse(c, StatusCodes.BAD_REQUEST, err),
		)
		.otherwise(() =>
			createErrorResponse(c, StatusCodes.INTERNAL_SERVER_ERROR, {
				unknown: ["an error occurred"],
			}),
		);

	if (!NORMAL_ERROR_CODES.includes(result.status)) {
		console.error(result.logInfo);
	}

	return result.response;
};
