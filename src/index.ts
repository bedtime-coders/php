import { serve } from "@hono/node-server";
import chalk from "chalk";
import { app } from "./app";
import { env } from "./env";

console.info(chalk.gray("Starting PHp*"));

serve(
	{ fetch: app.fetch, port: env.PORT, hostname: env.HOSTNAME },
	({ port }) => {
		console.info(
			`PHp* is up and running on ${chalk.blue(`http://${env.HOSTNAME}:${port}`)}`,
		);
	},
);
