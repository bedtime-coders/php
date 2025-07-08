import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "@/shared/constants";
import { CreateUser, LoginUser, User } from "./users.schema";

export const loginRoute = createRoute({
	method: "post",
	path: "/login",
	request: {
		body: {
			content: {
				"application/json": {
					schema: LoginUser,
				},
			},
		},
	},
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Login successful",
		},
	},
});

export const registerRoute = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateUser,
				},
			},
		},
	},
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Registration successful",
		},
	},
});
