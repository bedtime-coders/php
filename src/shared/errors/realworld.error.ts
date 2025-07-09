export class RealWorldError extends Error {
	constructor(public errors: Record<string, string[]>) {
		super(JSON.stringify(errors));
		this.name = "RealWorldError";
	}
}
