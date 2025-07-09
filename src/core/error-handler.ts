import { Prisma } from "@prisma/client";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { NORMAL_ERROR_CODES, StatusCodes } from "@/shared/constants";
import { ApiError, getDbError } from "@/shared/errors";

function parseWwwAuthenticate(header: string) {
	const errorMatch = header.match(/error="([^"]+)"/);
	const descMatch = header.match(/error_description="([^"]+)"/);
	return {
		error: errorMatch ? errorMatch[1] : "unknown",
		description: descMatch ? descMatch[1] : "An error occurred",
	};
}

function isApiError(err: unknown): err is ApiError {
	return err instanceof ApiError;
}

export const errorHandler = async (err: Error, c: Context) => {
	let logInfo: unknown = err;
	let status: number = StatusCodes.INTERNAL_SERVER_ERROR;
	let response: Response = c.json(
		{
			errors: {
				unknown: ["an error occurred"],
			},
		},
		status as ContentfulStatusCode,
	);
	if (isApiError(err)) {
		status = err.status;
		logInfo = err;
		response = c.json({ errors: err.errors }, status as ContentfulStatusCode);
	} else if (err instanceof HTTPException) {
		const res = err.getResponse();
		status = res.status;
		const resClone = res.clone();
		const contentType = resClone.headers.get("content-type") || "";
		const wwwAuth = resClone.headers.get("WWW-Authenticate");
		if (wwwAuth) {
			const { error, description } = parseWwwAuthenticate(wwwAuth);
			logInfo = { error, description, status: res.status };
			response = c.json(
				{
					errors: {
						[error]: [description],
					},
				},
				res.status as ContentfulStatusCode,
			);
		} else if (contentType.includes("application/json")) {
			const body = await resClone.json();
			logInfo = body;
			response = res;
		} else {
			const text = await resClone.text();
			logInfo = text;
			response = res;
		}
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		const dbError = getDbError(err);
		status = dbError.status;
		logInfo = err;
		response = c.json(dbError.object, status as ContentfulStatusCode);
	} else {
		logInfo = err;
	}

	if (!NORMAL_ERROR_CODES.includes(status)) {
		console.error(logInfo);
	}
	return response;
};
