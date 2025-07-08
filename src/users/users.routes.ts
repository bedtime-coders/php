import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "@/shared/constants";
import { CreateUser, LoginUser, UpdateUser, User } from "./users.schema";

export const loginRoute = createRoute({
	method: "post",
	path: "/login",
	summary: "Authentication",
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
	summary: "Registration",
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

export const getCurrentUserRoute = createRoute({
	method: "get",
	path: "/",
	summary: "Get Current User",
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: User,
				},
			},
			description: "Get current user",
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: "Unauthorized",
		},
	},
	security: [{ Token: [] }],
});

export const updateUserRoute = createRoute({
	method: "put",
	path: "/",
	summary: "Update User",
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
		[StatusCodes.UNAUTHORIZED]: {
			description: "Unauthorized",
		},
	},
	security: [{ Token: [] }],
});
