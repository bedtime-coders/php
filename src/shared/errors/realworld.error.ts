export class RealWorldError extends Error {
	constructor(public errors: Record<string, string[]>) {
		super(JSON.stringify(errors));
		this.name = "RealWorldError";
	}
}

export const createRealWorldError = (
	name: string,
	errors: Record<string, string[]>,
) => {
	const error = new RealWorldError(errors);
	error.name = name;
	return error;
};
