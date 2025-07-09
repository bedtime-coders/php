import { createApp } from "@/shared/utils";
import { toResponse } from "./mappers";
import * as routes from "./users.routes";
import * as service from "./users.service";

const app = createApp();

/**
 * Authentication
 */
app.openapi(routes.login, async ({ req, json }) => {
	const { user } = req.valid("json");
	const result = await service.login({ user });
	return json(toResponse(result.user, result.token));
});

/**
 * Registration
 */
app.openapi(routes.register, async ({ req, json }) => {
	const { user } = req.valid("json");
	const result = await service.create({ user });
	return json(toResponse(result.user, result.token));
});

export const usersController = app;
