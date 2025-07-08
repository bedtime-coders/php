import type { User } from "@prisma/client";
import { db } from "@/core/db";
import { assertNoConflicts } from "@/shared/errors";
import type { CreateUser, LoginUser, UpdateUser } from "./users.schema";
import { hashPassword, signToken, verifyPassword } from "./utils";

export const login = async ({
	user: { email, password },
}: LoginUser): Promise<{
	user: User;
	token: string;
}> => {
	const user = await db.user.findFirstOrThrow({
		where: { email },
	});
	if (!(await verifyPassword(password, user.password)))
		throw new Error("Invalid credentials");

	const token = await signToken({
		uid: user.id,
		email: user.email,
		username: user.username,
	});
	return {
		user,
		token,
	};
};

export const create = async ({
	user: { email, password, username },
}: CreateUser): Promise<{
	user: User;
	token: string;
}> => {
	await assertNoConflicts(
		"user",
		{
			email,
			username,
		},
		async (key, value) => {
			const existing = await db.user.findFirst({
				where: { [key]: value },
			});
			return Boolean(existing);
		},
	);
	const createdUser = await db.user.create({
		data: {
			email,
			password: await hashPassword(password),
			username,
		},
	});
	const token = await signToken({
		uid: createdUser.id,
		email: createdUser.email,
		username: createdUser.username,
	});
	return { user: createdUser, token };
};

export const update = async (
	id: string,
	{ user }: UpdateUser,
): Promise<{
	user: User;
	token: string;
}> => {
	const { email, username, password } = user;
	await assertNoConflicts(
		"user",
		{
			email,
			username,
		},
		async (key, value) => {
			const existing = await db.user.findFirst({
				where: { [key]: value },
			});
			return Boolean(existing);
		},
	);
	const updatedUser = await db.user.update({
		where: { id },
		data: {
			...user,
			password: password ? await hashPassword(password) : undefined,
		},
	});
	const token = await signToken({
		uid: updatedUser.id,
		email: updatedUser.email,
		username: updatedUser.username,
	});
	return { user: updatedUser, token };
};

export const findOne = async (
	id: string,
): Promise<{
	user: User;
	token: string;
}> => {
	const user = await db.user.findFirstOrThrow({ where: { id } });
	const token = await signToken({
		uid: user.id,
		email: user.email,
		username: user.username,
	});
	return { user, token };
};
