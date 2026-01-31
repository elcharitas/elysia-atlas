import * as p from "node:path";
import { mkdirSync } from "node:fs";

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

	const outputDir = p.dirname(options.output);
	const imports: string[] = [];
	const typeIds: [string, string][] = [];

	files.forEach((file, index) => {
		const typeId = `Route${index}`;
		let relativeImportPath = p.relative(p.dirname(options.output), p.join(options.dir, file));

		if (!relativeImportPath.startsWith(".")) {
			relativeImportPath = `./${relativeImportPath}`;
		}

		imports.push(`import type ${typeId} from "${relativeImportPath.substring(0, relativeImportPath.length - p.extname(relativeImportPath).length)}";`);
		typeIds.push([typeId, p.join(options.prefix ?? "/", file).replace(/\/index\.ts$|\.ts$/, "")] as const);
	});

	mkdirSync(p.dirname(options.output), { recursive: true });
	await Bun.write(options.output, `/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
${imports.join("\n")}
export type AutoloadedRoutes = ${typeIds.map(([id, path]) => `WithBasePath<ReturnType<typeof ${id}>, "${path}">`).join(" & ")};
`);
}
