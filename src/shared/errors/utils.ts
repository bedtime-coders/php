import type { Prisma } from "@prisma/client";
import camelcase from "camelcase";
import type { ValidationTargets } from "hono";
import type { ZodError } from "zod";
import { DEFAULT_ENTITY_NAME, StatusCodes } from "../constants";
import { ConflictingFieldsError } from "./conflicting-fields.error";
import { PrismaErrorCode } from "./prisma";

type Fields<T extends string> = Partial<Record<T, string>>;

/**
 * Assert that no conflicts exist in the given fields.
 * @param entity The entity that is being checked for conflicts, singular. (e.g. "user")
 * @param fields A mapping of fields to check for conflicts, keyed by field name, value by field value. (e.g. `{ email: "test@example.com" }`)
 * @param queryFn A function that returns a boolean indicating whether a conflict exists.
 * @throws If a conflict is found ({@link ConflictingFieldsError})
 *
 * @example
 * ```ts
 * await assertNoConflicts("user", { email: "test@example.com" }, async (field, value) => {
 *   const existing = await db.query.users.findFirst({ where: eq(users[field], value) });
 *   return Boolean(existing);
 * });
 * ```
 */
export async function assertNoConflicts<T extends string>(
	entity: string,
	fields: Fields<T>,
	queryFn: (key: T, value: string) => Promise<boolean>,
): Promise<void> {
	const entries = Object.entries(fields) as [T, string | undefined][];

	const conflicts = await Promise.all(
		entries.map(async ([key, value]) =>
			value && (await queryFn(key, value)) ? key : null,
		),
	);

	const conflictingFields = conflicts.filter(
		(f): f is Awaited<T> => f !== null,
	);

	if (conflictingFields.length > 0) {
		throw new ConflictingFieldsError(entity, conflictingFields);
	}
}

const modelToEntityName = (model: string) => camelcase(model);

const getEntityNameFromMeta = (
	meta: Prisma.PrismaClientKnownRequestError["meta"],
): string => {
	if (!meta) return DEFAULT_ENTITY_NAME;

	// Check if meta.cause matches "No 'EntityName' record" pattern
	if (meta.cause && typeof meta.cause === "string") {
		const match = meta.cause.match(/No '([^']+)' record/);
		if (match?.[1]) {
			return camelcase(match[1]);
		}
	}

	if (meta.modelName && typeof meta.modelName === "string")
		return modelToEntityName(meta.modelName);
	if (meta.model && typeof meta.model === "string")
		return modelToEntityName(meta.model);
	return DEFAULT_ENTITY_NAME;
};

export function getDbError(error: Prisma.PrismaClientKnownRequestError): {
	object: { errors: Record<string, string[]> };
	status: number;
} {
	if (error.code === PrismaErrorCode.RecordNotFound) {
		return {
			object: {
				errors: {
					[getEntityNameFromMeta(error.meta)]: ["not found"],
				},
			},
			status: StatusCodes.NOT_FOUND,
		};
	}
	if (!(error.code in PrismaErrorCode)) {
		console.error(error);
	}
	return {
		object: {
			errors: {
				database: ["error occurred"],
			},
		},
		status: StatusCodes.INTERNAL_SERVER_ERROR,
	};
}

export function formatZodErrors(
	result: { target: keyof ValidationTargets } & {
		success: false;
		error: ZodError;
	},
): Record<string, string[]> {
	return result.error.errors.reduce(
		(acc, error) => {
			const path = error.path.join(".");
			if (!acc[path]) {
				acc[path] = [];
			}
			acc[path].push(error.message);
			return acc;
		},
		{} as Record<string, string[]>,
	);
}
