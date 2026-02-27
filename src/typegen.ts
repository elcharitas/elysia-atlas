import { mkdirSync } from "node:fs";
import * as p from "node:path";

const normalizeSeparators = (value: string) => value.replace(/\\/g, "/");

export const toTypeImportPath = (output: string, dir: string, file: string) => {
	let relativeImportPath = p.relative(p.dirname(output), p.join(dir, file));
	relativeImportPath = normalizeSeparators(relativeImportPath);

	if (!relativeImportPath.startsWith(".")) {
		relativeImportPath = `./${relativeImportPath}`;
	}

	return relativeImportPath.substring(
		0,
		relativeImportPath.length - p.extname(relativeImportPath).length,
	);
};

export const toRouteLiteral = (filePath: string, prefix = "/") =>
	p.posix
		.join(normalizeSeparators(prefix), normalizeSeparators(filePath))
		.replace(/\/index\.ts$|\.ts$/, "")
		.replace(/\[([^\]]+)\]/g, ":$1");

export async function generateTypes(options: {
	dir: string;
	output: string;
	prefix?: string;
}) {
	const files: string[] = [];

	for await (const path of new Bun.Glob("**/*.ts").scan({ cwd: options.dir })) {
		if (!path.endsWith(".d.ts")) files.push(path);
	}

	// Sort for stable output
	files.sort();

	const imports: string[] = [];
	const typeIds: [string, string][] = [];

	files.forEach((file, index) => {
		const typeId = `Route${index}`;
		const relativeImportPath = toTypeImportPath(
			options.output,
			options.dir,
			file,
		);

		imports.push(`import type ${typeId} from "${relativeImportPath}";`);
		typeIds.push([
			typeId,
			toRouteLiteral(file, options.prefix ?? "/"),
		] as const);
	});

	mkdirSync(p.dirname(options.output), { recursive: true });
	const autoloadedImportLine = typeIds.length
		? `import type { WithBasePath } from "elysia-atlas/types";`
		: `import type Elysia from "elysia";`;

	const autoloadedRoutesType =
		typeIds.length === 0
			? "Elysia"
			: typeIds
					.map(
						([id, path]) => `WithBasePath<ReturnType<typeof ${id}>, "${path}">`,
					)
					.join(" & ");

	await Bun.write(
		options.output,
		`/* eslint-disable */
// @ts-nocheck
${autoloadedImportLine}
${imports.join("\n")}
export type AutoloadedRoutes = ${autoloadedRoutesType};
`,
	);
}
