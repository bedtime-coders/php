import { z } from "@hono/zod-openapi";

export const JwtPayload = z.object({
	uid: z.string(),
	email: z.string().email(),
	username: z.string(),
});
export type JwtPayload = z.infer<typeof JwtPayload>;
