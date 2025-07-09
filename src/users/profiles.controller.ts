import { createApp } from "@/core/utils";
import { toProfileResponse, toResponse } from "./mappers";
import * as routes from "./users.routes";
import * as service from "./users.service";

const app = createApp();

/**
 * Get Profile
 */
app.openapi(routes.getProfile, async ({ json, get, req }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload") || {};
	const result = await service.getProfile(username, currentUserId);
	return json(toResponse(result.profile, result.following));
});

/**
 * Follow User
 */
app.openapi(routes.followUser, async ({ req, json, get }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload");
	const result = await service.follow(username, currentUserId);
	return json(toProfileResponse(result.profile, result.following));
});

/**
 * Unfollow User
 */
app.openapi(routes.unfollowUser, async ({ req, json, get }) => {
	const username = req.param("username");
	const { uid: currentUserId } = get("jwtPayload");
	const result = await service.unfollow(username, currentUserId);
	return json(toProfileResponse(result.profile, result.following));
});

export const profilesController = app;
