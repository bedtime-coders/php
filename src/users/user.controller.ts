import { createApp } from "@/core/utils";
import { getCurrentUserRoute, updateUserRoute } from "./users.routes";
import * as usersService from "./users.service";

const app = createApp({ auth: true });

/**
 * Get current user
 */
app.openapi(getCurrentUserRoute, async ({ json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const { user, token } = await usersService.findOne(currentUserId);
	return json({ user: { ...user, token } });
});

/**
 * Update user
 */
app.openapi(updateUserRoute, async ({ req, json, get }) => {
	const { uid: currentUserId } = get("jwtPayload");
	const update = req.valid("json");
	const { user, token } = await usersService.update(currentUserId, update);
	return json({ user: { ...user, token } });
});

export const userController = app;
