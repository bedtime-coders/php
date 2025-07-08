export interface UserResponse {
	user: {
		token: string;
		email: string;
		username: string;
		bio: string | null;
		image: string | null;
	};
}
