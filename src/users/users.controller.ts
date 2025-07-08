import { createApp } from "@/core/utils";
import { toResponse } from "./users.mappers";
import { loginRoute, registerRoute } from "./users.routes";
import * as usersService from "./users.service";

const app = createApp();

/**
 * Login
 */
app.openapi(loginRoute, async ({ req, json }) => {
	const { email, password } = req.valid("json").user;
	const { user, token } = await usersService.login({
		user: { email, password },
	});
	return json(toResponse(user, token));
});

/**
 * Register
 */
app.openapi(registerRoute, async ({ req, json }) => {
	const { email, password, username, bio, image } = req.valid("json").user;
	const { user, token } = await usersService.create({
		user: { email, password, username, bio, image },
	});
	return json(toResponse(user, token));
});

export const usersController = app;
