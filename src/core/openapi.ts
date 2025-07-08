import { serveStatic } from "@hono/node-server/serve-static";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import type { Env } from "hono";
import { description, title } from "../../package.json";
import { env } from "./env";

export function registerOpenapi<E extends Env>(
	app: OpenAPIHono<E>,
	urls: { json: string; scalar: string },
) {
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
}
