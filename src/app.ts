import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { description, title } from "../package.json";
import { env } from "./env";
import { userController } from "./users/user.controller";
import { usersController } from "./users/users.controller";

const urls = {
	json: "/docs/json",
	scalar: "/docs",
};

export const app = new OpenAPIHono();

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

app.get(
	urls.scalar,
	Scalar({
		url: urls.json,
		pageTitle: title,
	}),
);

app.get("/", ({ redirect }) => redirect(urls.scalar));

app.route("/users", usersController);
app.route("/user", userController);
