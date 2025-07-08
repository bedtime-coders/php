import { openapi } from "@bedtime-coders/elysia-openapi";
import { Elysia, t } from "elysia";
import { db } from "@/db";
import { envPlugin } from "@/env";
import { description, title } from "../package.json";
import { users } from "./schema";

export const app = new Elysia()
	.use(envPlugin)
	.use(
		openapi({
			documentation: {
				info: { title, version: "", description },
			},
			exclude: ["/"],
		}),
	)
	.get("/", ({ redirect }) => redirect("/docs"))
	.get("/hello", ({ env }) => `Hello Bedstack on port ${env.PORT}`)
	.post(
		"/users",
		async ({ body }) => {
			const user = await db.insert(users).values(body).returning();
			return user;
		},
		{
			body: t.Object({
				name: t.String({ minLength: 2, examples: ["John Doe"] }),
			}),
		},
	);
