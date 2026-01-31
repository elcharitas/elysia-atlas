/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "../src/types";
import type Route0 from "./routes/index";
import type Route1 from "./routes/users";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, ""> & WithBasePath<ReturnType<typeof Route1>, "/users">;
