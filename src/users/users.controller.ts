import { createApp } from "@/core/utils";
import { toResponse } from "./mappers";
import { loginRoute, registerRoute } from "./users.routes";
import * as usersService from "./users.service";

const app = createApp();

/**
 * Authentication
 */
app.openapi(loginRoute, async ({ req, json }) => {
	const { user } = req.valid("json");
	const result = await usersService.login({ user });
	return json(toResponse(result.user, result.token));
});

/**
 * Registration
 */
app.openapi(registerRoute, async ({ req, json }) => {
	const { user } = req.valid("json");
	const result = await usersService.create({ user });
	return json(toResponse(result.user, result.token));
});

export const usersController = app;
