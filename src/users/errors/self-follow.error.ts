import { RealWorldError } from "@/shared/errors/realworld.error";

export class SelfFollowError extends RealWorldError {
	constructor() {
		super({
			profile: ["cannot be followed/unfollowed by yourself"],
		});
		this.name = "SelfFollowError";
	}
}
