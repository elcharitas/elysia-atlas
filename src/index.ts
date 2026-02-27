import { join, posix, resolve } from "node:path";
import Elysia from "elysia";

const normalizeSeparators = (value: string) => value.replace(/\\/g, "/");

export const toRoutePath = (filePath: string, prefix = "/") =>
	posix
		.join(normalizeSeparators(prefix), normalizeSeparators(filePath))
		.replace(/\/index\.ts$|\.ts$/, "")
		.replace(/\[([^\]]+)\]/g, ":$1");

/**
 * Autoload routes from a directory.
 * @param options - Options for autoloading routes.
 * @returns The autoloaded routes.
 */
export async function autoload<T = Elysia>(
	options: {
		/**
		 * The directory to autoload routes from.
		 */
		dir?: string;
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
	} = {},
): Promise<T> {
	const dir = options.dir ?? "./routes";

	if (options.typegen) {
		const { generateTypes } = await import("./typegen");
		const output =
			typeof options.typegen === "string"
				? options.typegen
				: join(dir, "../routes.d.ts");

		await generateTypes({
			dir,
			prefix: options.prefix,
			output,
		});
	}

	const app = new Elysia({
		name: "autoload",
		seed: dir,
	});

	for await (const path of new Bun.Glob("**/*.ts").scan({ cwd: dir })) {
		if (path.endsWith(".d.ts")) continue;

		const module = await import(resolve(dir, path));

		if (typeof module.default !== "function")
			throw new Error(`autoload: "${path}" must export a function`);

		app.group(toRoutePath(path, options.prefix ?? "/"), module.default);
	}

	return app as T;
}
