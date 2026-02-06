/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
import type Route0 from "./extra-routes/notifications";
import type Route1 from "./extra-routes/profile";
import type Route2 from "./extra-routes/settings/preferences";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, "/extra/notifications"> & WithBasePath<ReturnType<typeof Route1>, "/extra/profile"> & WithBasePath<ReturnType<typeof Route2>, "/extra/settings/preferences">;
