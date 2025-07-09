import { createApp } from "@/core/utils";
import { toResponse } from "./mappers";
import * as routes from "./users.routes";
import * as service from "./users.service";

const app = createApp();

/**
 * Get Profile
 */
app.openapi(routes.getProfile, async ({ json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const result = await service.findOne(currentUserId);
	return json(toResponse(result.user, result.token));
});

/**
 * Update User
 */
app.openapi(routes.updateUser, async ({ req, json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const { user } = req.valid("json");
	const result = await service.update(currentUserId, { user });
	return json(toResponse(result.user, result.token));
});

export const userController = app;
