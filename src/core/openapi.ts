import { serveStatic } from "@hono/node-server/serve-static";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import type { Env } from "hono";
import { description, repository, title } from "../../package.json";
import { env } from "./env";

function getRepositoryUrlLabel(url: string) {
	// match the author and repo name with regex
	const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
	if (!match) return undefined;
	const [, author, repo] = match;
	return `${author}/${repo} on GitHub`;
}

function getDescription() {
	let out = description;
	const url = repository?.url;
	if (url) {
		const label = getRepositoryUrlLabel(url);
		out += `\n\n[${label}](${url})`;
	}
	return out;
}

export function registerOpenapi<E extends Env>(
	app: OpenAPIHono<E>,
	urls: { json: string; scalar: string },
) {
	app.doc(urls.json, {
		openapi: "3.0.0",
		info: {
			title,
			version: "",
			description: getDescription(),
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
	app.openAPIRegistry.registerComponent("securitySchemes", "Token", {
		type: "apiKey",
		description: 'Prefix the token with "Token ", e.g. "Token jwt.token.here"',
		in: "header",
		name: "Authorization",
	});
}
