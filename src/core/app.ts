import { serveStatic } from "@hono/node-server/serve-static";
import { Scalar } from "@scalar/hono-api-reference";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { NORMAL_ERROR_CODES, StatusCodes } from "@/shared/constants";
import { description, title } from "../../package.json";
import { userController } from "../users/user.controller";
import { usersController } from "../users/users.controller";
import { env } from "./env";
import { createApp } from "./utils";

const urls = {
	json: "/docs/json",
	scalar: "/docs",
};

export const app = createApp();

// --- OpenAPI ---
app.doc(urls.json, {
	openapi: "3.0.0",
	info: {
		title,
		version: "",
		description,
	},
	servers: [
		{
			url: `http://${env.HOSTNAME}:${env.PORT}`,
			description: "Local server",
		},
	],
});
app.use("/favicon.ico", serveStatic({ path: "./static/favicon.ico" }));
app.get(
	urls.scalar,
	Scalar({
		url: urls.json,
		pageTitle: title,
		favicon: "/favicon.ico",
	}),
);
app.get("/", ({ redirect }) => redirect(urls.scalar));
//

function parseWwwAuthenticate(header: string) {
	const errorMatch = header.match(/error="([^"]+)"/);
	const descMatch = header.match(/error_description="([^"]+)"/);
	return {
		error: errorMatch ? errorMatch[1] : "unknown",
		description: descMatch ? descMatch[1] : "An error occurred",
	};
}

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
