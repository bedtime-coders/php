import { createApp } from "@/shared/utils";
import { profilesController } from "@/users/profiles.controller";
import { userController } from "@/users/user.controller";
import { usersController } from "@/users/users.controller";
import { errorHandler } from "./error-handler";
import { registerOpenapi } from "./openapi";

export const app = createApp();

registerOpenapi(app, {
	json: "/docs/json",
	scalar: "/docs",
});
app.onError(errorHandler);

app.route("/users", usersController);
app.route("/user", userController);
app.route("/profiles", profilesController);
