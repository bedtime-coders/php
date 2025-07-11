import type { User } from "@prisma/client";
import type { User as UserResponse } from "../users.schema";

/**
 * Map a user to a response
 * @param user The user to map
 * @param token A signed token for the user
 * @returns The mapped user
 */
export const toResponse = (
	{ email, username, bio, image }: User,
	token: string,
): UserResponse => ({
	user: {
		token,
		email,
		username,
		bio,
		image,
	},
});
