import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { treaty } from "@elysiajs/eden";
import { autoload } from "../src/index";
import { app } from "../example";

describe("Treaty", () => {
    it("should work with treaty", async () => {
        const client = treaty<typeof app>(app);

        const { data: indexData, error: indexError } = await client.get();
        expect(indexError).toBeNull();
        expect(indexData).toBe("Hello from Example!");

        const { data: userData, error: userError } = await client.users.user.get();
        expect(userError).toBeNull();
        expect(userData).toEqual({ name: "Elysia User" });
    });

    it("should work with treaty and prefix", async () => {
        const app = new Elysia().use(
            await autoload({
                dir: "./example/routes",
                prefix: "/api",
                typegen: "./example/api-routes.d.ts"
            })
        );

        const response = await app.handle(new Request("http://localhost/api/users/user"));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ name: "Elysia User" });
    });
});
