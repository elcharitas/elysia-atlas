import type Elysia from "elysia";
import type { CreateEden, RouteBase, RouteSchema } from "elysia";

type FlattenIndex<T extends RouteBase> =
	T extends Record<string, infer P>
		? P extends RouteSchema
			? T
			: T extends Record<"", infer Root>
				? Root extends RouteBase
					? FlattenIndex<Root>
					: never
				: T extends Record<string, infer P>
					? P extends RouteSchema
						? FlattenIndex<T>
						: T
					: never
		: never;

/**
 * Only carries the Routes type parameter forward; all others reset to `any`
 * to prevent intersections from collapsing to `never` (breaking Eden Treaty).
 */
export type WithBasePath<App, Prefix extends string> =
	App extends Elysia<any, any, any, any, infer Routes, any, any>
		? Elysia<
				any,
				any,
				any,
				any,
				FlattenIndex<CreateEden<Prefix, Routes>> extends RouteBase
					? FlattenIndex<CreateEden<Prefix, Routes>>
					: Routes,
				any,
				any
			>
		: never;
