import type Elysia from "elysia";
import type { CreateEden } from "elysia";

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
			CreateEden<Prefix, Routes>,
			Ephemeral,
			Volatile
		>
	: never;
