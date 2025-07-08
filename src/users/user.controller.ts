import { createApp } from "@/core/utils";
import { toResponse } from "./mappers";
import { getCurrentUserRoute, updateUserRoute } from "./users.routes";
import * as usersService from "./users.service";

const app = createApp({ auth: true });

/**
 * Get Current User
 */
app.openapi(getCurrentUserRoute, async ({ json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const result = await usersService.findOne(currentUserId);
	return json(toResponse(result.user, result.token));
});

/**
 * Update User
 */
app.openapi(updateUserRoute, async ({ req, json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const { user } = req.valid("json");
	const result = await usersService.update(currentUserId, { user });
	return json(toResponse(result.user, result.token));
});

export const userController = app;
