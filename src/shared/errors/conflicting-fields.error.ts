import { objectify } from "radashi";
import { StatusCodes } from "@/shared/constants";
import { RealWorldError } from "./realworld.error";

export class ConflictingFieldsError extends RealWorldError {
	constructor(
		/**
		 * The entity that the conflicting fields belong to, singularized
		 * @example "user"
		 */
		public entity: string,
		/**
		 * List of fields that are conflicting
		 * @example ["email", "username"]
		 */
		public fields: string[],
	) {
		super(
			StatusCodes.CONFLICT,
			objectify(
				fields,
				(field) => `${entity}.${field}`,
				() => ["is already taken"],
			),
		);
	}
}
