import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "@/shared/constants";
import { CreateUser, LoginUser, UpdateUser, User } from "./users.schema";

export const login = createRoute({
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
		[StatusCodes.UNPROCESSABLE_CONTENT]: {
			description: "Malformed request body",
		},
	},
});

export const register = createRoute({
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
		[StatusCodes.UNPROCESSABLE_CONTENT]: {
			description: "Malformed request body",
		},
	},
});

export const getCurrentUser = createRoute({
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

export const updateUser = createRoute({
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
		[StatusCodes.UNPROCESSABLE_CONTENT]: {
			description: "Malformed request body",
		},
	},
	security: [{ Token: [] }],
});
