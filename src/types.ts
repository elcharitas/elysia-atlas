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
 * Extracts routes from an Elysia app type and prefixes them.
 *
 * Only the Routes type parameter is carried forward — all other Elysia type
 * parameters (Singleton, Definitions, Metadata, Ephemeral, Volatile) are reset
 * to `any`. This prevents intersections of multiple `WithBasePath` results
 * from collapsing non-route type parameters to `never`, which would break
 * Eden Treaty's `Elysia<any, …>` constraint.
 */
export type WithBasePath<App, Prefix extends string> = App extends Elysia<
	any,
	any,
	any,
	any,
	infer Routes,
	any,
	any
>
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
