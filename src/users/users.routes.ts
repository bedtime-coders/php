import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "@/shared/constants";
import {
	CreateUser,
	LoginUser,
	Profile,
	UpdateUser,
	User,
} from "./users.schema";

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

export const getProfile = createRoute({
	method: "get",
	path: "/{username}",
	summary: "Get Profile",
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: Profile,
				},
			},
			description: "Profile found",
		},
		[StatusCodes.NOT_FOUND]: {
			description: "Profile not found",
		},
	},
});

export const followUser = createRoute({
	method: "post",
	path: "/{username}/follow",
	summary: "Follow user",
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: Profile,
				},
			},
			description: "Now following user",
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: "Unauthorized",
		},
		[StatusCodes.NOT_FOUND]: {
			description: "Profile not found",
		},
	},
	security: [{ Token: [] }],
});

export const unfollowUser = createRoute({
	method: "delete",
	path: "/{username}/follow",
	summary: "Unfollow user",
	responses: {
		[StatusCodes.OK]: {
			content: {
				"application/json": {
					schema: Profile,
				},
			},
			description: "No longer following user",
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: "Unauthorized",
		},
		[StatusCodes.NOT_FOUND]: {
			description: "Profile not found",
		},
	},
	security: [{ Token: [] }],
});
