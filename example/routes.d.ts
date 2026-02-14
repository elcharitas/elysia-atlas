/* eslint-disable */
// @ts-nocheck
import type { WithBasePath } from "elysia-atlas/types";
import type Route0 from "./routes/admin/analytics/[section]/index";
import type Route1 from "./routes/admin/analytics/overview";
import type Route2 from "./routes/admin/settings";
import type Route3 from "./routes/auth/callback";
import type Route4 from "./routes/auth/session";
import type Route5 from "./routes/auth/sign-in";
import type Route6 from "./routes/auth/sign-out";
import type Route7 from "./routes/auth/sign-up";
import type Route8 from "./routes/auth/verify-email";
import type Route9 from "./routes/health";
import type Route10 from "./routes/index";
import type Route11 from "./routes/posts";
import type Route12 from "./routes/users";
export type AutoloadedRoutes = WithBasePath<ReturnType<typeof Route0>, "/admin/analytics/:section"> & WithBasePath<ReturnType<typeof Route1>, "/admin/analytics/overview"> & WithBasePath<ReturnType<typeof Route2>, "/admin/settings"> & WithBasePath<ReturnType<typeof Route3>, "/auth/callback"> & WithBasePath<ReturnType<typeof Route4>, "/auth/session"> & WithBasePath<ReturnType<typeof Route5>, "/auth/sign-in"> & WithBasePath<ReturnType<typeof Route6>, "/auth/sign-out"> & WithBasePath<ReturnType<typeof Route7>, "/auth/sign-up"> & WithBasePath<ReturnType<typeof Route8>, "/auth/verify-email"> & WithBasePath<ReturnType<typeof Route9>, "/health"> & WithBasePath<ReturnType<typeof Route10>, ""> & WithBasePath<ReturnType<typeof Route11>, "/posts"> & WithBasePath<ReturnType<typeof Route12>, "/users">;
