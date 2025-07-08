import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { StatusCodes } from "http-status-codes";
import { app } from "./app";

const api = treaty(app);

describe("Health check", () => {
	it(`returns a ${StatusCodes.OK} response`, async () => {
		const { status, data } = await api.hello.get();
		console.log(data);
		expect(status).toBe(StatusCodes.OK);
	});
});

describe("OpenAPI", () => {
	const url = "http://localhost/docs";
	it(`returns a ${StatusCodes.OK} response`, async () => {
		const reponse = await app.handle(new Request(url));
		expect(reponse.status).toBe(StatusCodes.OK);
	});
});
