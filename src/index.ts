import { join, posix, resolve } from "node:path";
import { globSync } from "glob";
import Elysia from "elysia";

const normalizeSeparators = (value: string) => value.replace(/\\/g, "/");

const isIntercept = (normalized: string) =>
	normalized === "intercept.ts" || normalized.endsWith("/intercept.ts");

export const toRoutePath = (filePath: string, prefix = "/") =>
	posix
		.join(normalizeSeparators(prefix), normalizeSeparators(filePath))
		.replace(/\/index\.ts$|\.ts$/, "")
		.replace(/\[([^\]]+)\]/g, ":$1");

/** Walk from root to the file's parent, collecting each `intercept.ts` (outermost first). */
function collectIntercepts(
	interceptMap: Map<string, CallableFunction>,
	filePath: string,
): CallableFunction[] {
	const parts = normalizeSeparators(filePath).split("/").slice(0, -1);
	const result: CallableFunction[] = [];

	// "." represents the root-level intercept.ts
	const rootIntercept = interceptMap.get(".");
	if (rootIntercept) result.push(rootIntercept);

	let current = "";
	for (const part of parts) {
		current = current ? `${current}/${part}` : part;
		const intercept = interceptMap.get(current);
		if (intercept) result.push(intercept);
	}

	return result;
}

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

	const interceptPaths: string[] = [];
	const routePaths: string[] = [];
	const absDir = resolve(dir);

	const files = globSync("**/*.ts", { cwd: dir });
	for (const path of files) {
		if (path.endsWith(".d.ts")) continue;
		const normalized = normalizeSeparators(path);
		if (isIntercept(normalized)) {
			interceptPaths.push(normalized);
		} else {
			routePaths.push(path);
		}
	}

	const interceptMap = new Map<string, CallableFunction>();
	if (interceptPaths.length > 0) {
		const loaded = await Promise.all(
			interceptPaths.map(async (normalized) => {
				const mod = await import(join(absDir, normalized));
				if (typeof mod.default !== "function")
					throw new Error(
						`autoload: intercept "${normalized}" must export a function`,
					);
				const dirKey =
					normalized === "intercept.ts"
						? "."
						: normalized.slice(0, -"/intercept.ts".length);
				return [dirKey, mod.default] as const;
			}),
		);
		for (const [key, fn] of loaded) interceptMap.set(key, fn);
	}

	const routeModules = await Promise.all(
		routePaths.map(async (path) => {
			const mod = await import(join(absDir, path));
			if (typeof mod.default !== "function")
				throw new Error(`autoload: "${path}" must export a function`);
			return { path, handler: mod.default };
		}),
	);

	const prefix = options.prefix ?? "/";
	for (const { path, handler } of routeModules) {
		const intercepts = collectIntercepts(interceptMap, path);

		if (intercepts.length > 0) {
			app.group(toRoutePath(path, prefix), (group) => {
				let current = group;
				for (const fn of intercepts) {
					current = fn(current);
				}
				return handler(current);
			});
		} else {
			app.group(toRoutePath(path, prefix), handler);
		}
	}

	return app as T;
}
