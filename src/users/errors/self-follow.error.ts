import { RealWorldError } from "@/shared/errors/realworld.error";

export class SelfFollowError extends RealWorldError {
	constructor() {
		super({
			user: ["You cannot follow/unfollow yourself"],
		});
		this.name = "SelfFollowError";
	}
}
