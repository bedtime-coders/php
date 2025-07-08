import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const app = new OpenAPIHono();

app.openapi(
	createRoute({
		method: "get",
		path: "/users/{id}",
		request: {
			params: z.object({
				id: z.string(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							id: z.string(),
							age: z.number(),
							name: z.string(),
						}),
					},
				},
				description: "Retrieve the user",
			},
		},
	}),
	(c) => {
		const { id } = c.req.valid("param");
		return c.json(
			{
				id,
				age: 20,
				name: "Ultra-man",
			},
			200, // You should specify the status code even if it is 200.
		);
	},
);

// export const app = new Hono()
// 	.use(envPlugin)
// 	.use(
// 		openapi({
// 			documentation: {
// 				info: { title, version: "", description },
// 			},
// 			exclude: ["/"],
// 		}),
// 	)
// 	.get("/", ({ redirect }) => redirect("/docs"))
// 	.get("/hello", ({ env }) => `Hello Bedstack on port ${env.PORT}`)
// 	.post(
// 		"/users",
// 		async ({ body }) => {
// 			const user = await db.insert(users).values(body).returning();
// 			return user;
// 		},
// 		{
// 			body: t.Object({
// 				name: t.String({ minLength: 2, examples: ["John Doe"] }),
// 			}),
// 		},
// 	);
