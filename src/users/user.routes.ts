import { createRoute } from "@hono/zod-openapi";
import { UpdateUser, User } from "./users.schema";

export const getCurrentUserRoute = createRoute({
	method: "get",
	path: "/user",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Get current user",
		},
	},
});

export const updateUserRoute = createRoute({
	method: "put",
	path: "/user",
	request: {
		body: {
			content: {
				"application/json": {
					schema: UpdateUser,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Update user",
		},
	},
});
