import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute } from "./users.routes";

const app = new OpenAPIHono();

app.openapi(loginRoute, async ({ req, json }) => {
	const { email, password } = req.valid("json").user;
	const token = "123";
	const username = "jake";
	const bio = "I work at statefarm";
	const image = "https://i.pravatar.cc/150?img=1";
	console.log("Your password is:", password);
	return json({ user: { email, token, username, bio, image } });
});

export const usersController = app;
