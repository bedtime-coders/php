import { ApiError } from "./api.error";
export class RealWorldError extends ApiError {
	constructor(status: number, errors: Record<string, string[]>) {
		super(status, errors);
		this.name = "RealWorldError";
	}
}
