/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
import type Route0 from "./routes/index";
import type Route1 from "./routes/users";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, "/api"> & WithBasePath<ReturnType<typeof Route1>, "/api/users">;
