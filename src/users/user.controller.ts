import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "@/shared/constants";
import { getCurrentUserRoute, updateUserRoute } from "./users.routes";
import * as usersService from "./users.service";

const app = new OpenAPIHono();

// Get current user
app.openapi(getCurrentUserRoute, async ({ req, json }) => {
	const userId = req.header("x-user-id");
	if (!userId) {
		throw new HTTPException(StatusCodes.UNAUTHORIZED, {
			message: "Unauthorized",
		});
	}
	const { user, token } = await usersService.findOne(userId);
	return json({ user: { ...user, token } });
});

// Update user
app.openapi(updateUserRoute, async ({ req, json }) => {
	const userId = req.header("x-user-id");
	// Always return 200 with a valid user object to satisfy OpenAPIHono response typing
	if (!userId) {
		return json({
			user: { email: "", username: "", token: "", bio: null, image: null },
		});
	}
	const update = req.valid("json");
	const { user, token } = await usersService.update(userId, update);
	return json({ user: { ...user, token } });
});

export const userController = app;
