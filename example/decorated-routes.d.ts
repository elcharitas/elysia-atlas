/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
import type Route0 from "./decorated-routes/catalog/items";
import type Route1 from "./decorated-routes/login";
import type Route2 from "./decorated-routes/me";
import type Route3 from "./decorated-routes/register";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, "/v2/catalog/items"> & WithBasePath<ReturnType<typeof Route1>, "/v2/login"> & WithBasePath<ReturnType<typeof Route2>, "/v2/me"> & WithBasePath<ReturnType<typeof Route3>, "/v2/register">;
