import type Elysia from "elysia";
import type { CreateEden, RouteBase, RouteSchema } from "elysia";

type FlattenIndex<T extends RouteBase> =
	T extends Record<string, infer P>
		? P extends RouteSchema
			? T
			: T extends Record<string, infer Root>
				? Root extends RouteBase
					? FlattenIndex<Root>
					: T
				: T
		: never;

export type WithBasePath<App, Prefix extends string> = App extends Elysia<
	infer BasePath,
	infer Singleton,
	infer Definitions,
	infer Metadata,
	infer Routes,
	infer Ephemeral,
	infer Volatile
>
	? Elysia<
			BasePath,
			Singleton,
			Definitions,
			Metadata,
			FlattenIndex<CreateEden<Prefix, Routes>> extends RouteBase
				? FlattenIndex<CreateEden<Prefix, Routes>>
				: never,
			Ephemeral,
			Volatile
		>
	: never;
