import { createRoute } from "@hono/zod-openapi";
import * as StatusCodes from "@/shared/constants/http-status-codes";
import { UpdateUser, User } from "./users.schema";

export const getCurrentUserRoute = createRoute({
	method: "get",
	path: "/user",
	responses: {
		[StatusCodes.OK]: {
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
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Update user",
		},
	},
});
