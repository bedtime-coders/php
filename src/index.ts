import chalk from "chalk";
import { app } from "./app";
import { env } from "./env";

console.info(chalk.gray("Starting Bedstack"));

app.listen(env.PORT, ({ hostname, port }) => {
	console.info(
		`Bedstack is up and running on ${chalk.blue(`http://${hostname}:${port}`)}`,
	);
});
