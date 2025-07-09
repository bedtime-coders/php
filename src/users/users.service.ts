import type { User } from "@prisma/client";
import * as argon2 from "argon2";
import * as bcrypt from "bcrypt";
import * as jose from "jose";
import { db } from "@/core/db";
import { env } from "@/core/env";
import { assertNoConflicts } from "@/shared/errors";
import type { JwtPayload } from "@/shared/types";
import { name } from "../../package.json";
import type { CreateUser, LoginUser, UpdateUser } from "./users.schema";

const hashPassword = async (password: string) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	return isDevelopment
		? await bcrypt.hash(password, 10)
		: await argon2.hash(password);
};

const verifyPassword = async (password: string, hash: string) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	return isDevelopment
		? await bcrypt.compare(password, hash)
		: await argon2.verify(hash, password);
};

const signToken = async (payload: JwtPayload) => {
	const secret = new TextEncoder().encode(env.JWT_SECRET);

	return await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("24h")
		.setAudience(name)
		.setIssuedAt()
		.sign(secret);
};

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
		// TODO: Better error
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

export const getProfile = async (
	username: string,
	currentUserId?: string,
): Promise<{
	profile: User;
	following: boolean;
}> => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	const [{ exists: following } = { exists: false }] = await db.$queryRaw<
		{ exists: boolean }[]
	>`
  SELECT EXISTS (
    SELECT 1
    FROM "_UserFollows"
    WHERE "A" = ${currentUserId} AND "B" = ${profile.id}
  ) AS "exists"
`;
	return { profile, following };
};

export const follow = async (username: string, currentUserId: string) => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	// TODO: Make this a db constraint
	if (profile.id === currentUserId)
		// TODO: Better error
		throw new Error("You cannot follow yourself");
	await db.user.update({
		where: { id: currentUserId },
		data: { following: { connect: { id: profile.id } } },
	});
	return { profile, following: true };
};

export const unfollow = async (username: string, currentUserId: string) => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	// TODO: Make this a db constraint
	if (profile.id === currentUserId)
		// TODO: Better error
		throw new Error("You cannot unfollow yourself");
	await db.user.update({
		where: { id: currentUserId },
		data: { following: { disconnect: { id: profile.id } } },
	});
	return { profile, following: false };
};
