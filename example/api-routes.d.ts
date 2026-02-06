/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
import type Route0 from "./routes/admin/analytics/overview";
import type Route1 from "./routes/admin/settings";
import type Route2 from "./routes/auth/callback";
import type Route3 from "./routes/auth/session";
import type Route4 from "./routes/auth/sign-in";
import type Route5 from "./routes/auth/sign-out";
import type Route6 from "./routes/auth/sign-up";
import type Route7 from "./routes/auth/verify-email";
import type Route8 from "./routes/health";
import type Route9 from "./routes/index";
import type Route10 from "./routes/posts";
import type Route11 from "./routes/users";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, "/api/admin/analytics/overview"> & WithBasePath<ReturnType<typeof Route1>, "/api/admin/settings"> & WithBasePath<ReturnType<typeof Route2>, "/api/auth/callback"> & WithBasePath<ReturnType<typeof Route3>, "/api/auth/session"> & WithBasePath<ReturnType<typeof Route4>, "/api/auth/sign-in"> & WithBasePath<ReturnType<typeof Route5>, "/api/auth/sign-out"> & WithBasePath<ReturnType<typeof Route6>, "/api/auth/sign-up"> & WithBasePath<ReturnType<typeof Route7>, "/api/auth/verify-email"> & WithBasePath<ReturnType<typeof Route8>, "/api/health"> & WithBasePath<ReturnType<typeof Route9>, "/api"> & WithBasePath<ReturnType<typeof Route10>, "/api/posts"> & WithBasePath<ReturnType<typeof Route11>, "/api/users">;
