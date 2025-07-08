import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { NORMAL_ERROR_CODES, StatusCodes } from "@/shared/constants";
import { parseWwwAuthenticate } from "@/shared/errors";
import { userController } from "../users/user.controller";
import { usersController } from "../users/users.controller";
import { registerOpenapi } from "./openapi";
import { createApp } from "./utils";

export const app = createApp();

registerOpenapi(app, {
	json: "/docs/json",
	scalar: "/docs",
});

app.onError(async (err, c) => {
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

	if (err instanceof HTTPException) {
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
	} else {
		logInfo = err;
	}

	if (!NORMAL_ERROR_CODES.includes(status)) {
		console.error(logInfo);
	}
	return response;
});

app.route("/users", usersController);
app.route("/user", userController);
