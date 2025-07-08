import { z } from "@hono/zod-openapi";

export const UserEmail = z.string().email().openapi({
	description: "The email of the user",
	example: "jake@jake.jake",
});
export type UserEmail = z.infer<typeof UserEmail>;

export const UserBase = z.object({
	email: UserEmail,
	username: z.string().min(2).openapi({
		description: "The username of the user",
		example: "jake",
	}),
	bio: z
		.string()
		.min(2)
		.openapi({
			description: "The bio of the user",
			example: "I work at statefarm",
		})
		.optional()
		.nullable(),
	image: z
		.string()
		.url()
		.openapi({
			description: "The image of the user",
			example: "https://api.realworld.io/images/smiley-cyrus.jpg",
		})
		.optional()
		.nullable(),
});
export type UserBase = z.infer<typeof UserBase>;

export const Password = z.string().min(1).openapi({
	description: "The password of the user",
	example: "hunter2A",
});
export type Password = z.infer<typeof Password>;

export const PasswordStrict = z
	.string()
	.min(8)
	.max(100)
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
		message:
			"must be at least 8 characters and contain uppercase, lowercase, and numbers",
	})
	.openapi({
		description: "Password (min 8 chars, upper/lowercase, number)",
		example: "hunter2A",
	});
export type PasswordStrict = z.infer<typeof PasswordStrict>;

export const User = z.object({
	user: UserBase.merge(
		z.object({
			token: z.string().openapi({
				description: "JWT token",
				example:
					"eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJjbWN1dzR3d2IwMDAweDMxeDY1emE2bTVxIiwiZW1haWwiOiJqYWtlQGpha2UuamFrZSIsInVzZXJuYW1lIjoiamFrZSIsImV4cCI6MTc1MjA5ODQ0OCwiYXVkIjoicGhwIiwiaWF0IjoxNzUyMDEyMDQ4fQ.kvUhCyPi8h_x1oqQB1W6abnhKcEgyf-moho6z9IBJlg",
			}),
		}),
	),
});
export type User = z.infer<typeof User>;

export const CreateUser = z.object({
	user: UserBase.merge(z.object({ password: PasswordStrict })),
});
export type CreateUser = z.infer<typeof CreateUser>;

export const UpdateUser = z.object({
	user: CreateUser.shape.user.partial(),
});
export type UpdateUser = z.infer<typeof UpdateUser>;

export const LoginUser = z.object({
	user: z.object({
		email: UserEmail,
		password: Password,
	}),
});
export type LoginUser = z.infer<typeof LoginUser>;
