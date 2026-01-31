import { join, resolve } from "node:path";
import Elysia from "elysia";

/**
 * Autoload routes from a directory.
 * @param options - Options for autoloading routes.
 * @returns The autoloaded routes.
 */
export async function autoload<T = Elysia>(options: {
	/**
	 * The directory to autoload routes from.
	 */
	dir: string;
	/**
	 * The prefix to apply to all routes.
	 */
	prefix?: string;
	/**
	 * Whether to generate type definitions for the routes.
	 *
	 * This can be a boolean or a string representing the output path.
	 *
	 * @default false
	 */
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
			prefix: options.prefix,
			output,
		});
	}

	const app = new Elysia({
		name: "autoload",
		seed: options.dir,
	});

	for await (const path of new Bun.Glob("**/*.ts").scan({ cwd: options.dir })) {
		if (path.endsWith(".d.ts")) continue;

		const module = await import(resolve(options.dir, path));

		if (typeof module.default !== "function")
			throw new Error(`autoload: "${path}" must export a function`);

		app.group(
			join(options.prefix ?? "/", path).replace(/\/index\.ts$|\.ts$/, ""),
			module.default,
		);
	}

	return app as T;
}
