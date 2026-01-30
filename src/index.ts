import { Glob } from "bun";
import Elysia from "elysia";
import { join } from "node:path";

export async function autoload<T extends Elysia = Elysia>(options: {
	dir: string;
	prefix?: string;
	typegen?: boolean | string;
}): Promise<T> {
	if (options.typegen) {
		const { generateTypes } = await import("./typegen");
		const output =
			typeof options.typegen === "string"
				? options.typegen
				: join(options.dir, "../routes.d.ts");

		await generateTypes({
			dir: options.dir,
			output,
		});
	}

	const app = new Elysia({
		name: "autoload",
		seed: options.dir,
	});

	const glob = new Glob("**/*.ts");

	for await (const path of glob.scan({ cwd: options.dir, absolute: false })) {
		if (path.endsWith(".d.ts")) continue;

		const fullPath = join(options.dir, path);
		const module = await import(fullPath);

		// Check if verify export default is a function
		if (typeof module.default !== "function") {
			throw new Error(
				`Failed to autoload "${path}". Main export must be a function that accepts an Elysia instance.`,
			);
		}
		const fullRoutePath = join(options.prefix ?? "/", path)
			.replace(/\/index\.ts$/, "")
			.replace(/\.ts$/, "");
		app.group(fullRoutePath, module.default);
	}

	return app as T;
}
