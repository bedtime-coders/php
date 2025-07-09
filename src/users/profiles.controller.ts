import { createApp } from "@/core/utils";
import { toProfileResponse } from "./mappers";
import * as routes from "./users.routes";
import * as service from "./users.service";

const app = createApp();
const authenticatedApp = createApp({ auth: true });

/**
 * Get Profile
 */
app.openapi(routes.getProfile, async ({ json, get, req }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload") || {};
	const result = await service.getProfile(username, currentUserId);
	return json(toProfileResponse(result.profile, result.following));
});

/**
 * Follow user
 */
authenticatedApp.openapi(routes.followUser, async ({ req, json, get }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload") || {};
	const result = await service.follow(username, currentUserId);
	return json(toProfileResponse(result.profile, result.following));
});

/**
 * Unfollow user
 */
authenticatedApp.openapi(routes.unfollowUser, async ({ req, json, get }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload") || {};
	const result = await service.unfollow(username, currentUserId);
	return json(toProfileResponse(result.profile, result.following));
});

export const profilesController = createApp()
	.route("/", app)
	.route("/", authenticatedApp);
