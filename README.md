# elysia-atlas

Advanced file-system router for [ElysiaJS](https://elysiajs.com/) featuring **automatic type generation** and **strict type inference**.

<div align="center">

[![npm](https://img.shields.io/npm/v/elysia-atlas?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/elysia-atlas)
[![npm downloads](https://img.shields.io/npm/dw/elysia-atlas?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/elysia-atlas)
[![GitHub License](https://img.shields.io/github/license/elcharitas/elysia-atlas?logo=github&style=flat&labelColor=000&color=3b82f6)](https://github.com/elcharitas/elysia-atlas/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/elcharitas/elysia-atlas?logo=github&style=flat&labelColor=000&color=3b82f6)](https://github.com/elcharitas/elysia-atlas/stargazers)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/elysia-atlas?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://bundlephobia.com/package/elysia-atlas)
[![Bun](https://img.shields.io/badge/Bun-%3E%3D1.3.0-black?logo=bun&style=flat&labelColor=000&color=3b82f6)](https://bun.sh)

</div>

## Installation

```bash
bun add elysia-atlas
```

## Quick Start

### 1. Register the plugin

```typescript
import { Elysia } from "elysia";
import { autoload } from "elysia-atlas";

const app = new Elysia()
    .use(await autoload())
    .listen(3000);

// Export type for Eden or strict type safety
export type App = typeof app;
```

> [!IMPORTANT]
> It's important to use `await` when registering the plugin.

### 2. Create routes

Create a `routes` directory and add your endpoints. Each file must export a default function that accepts an Elysia instance.

```typescript
// routes/index.ts
import { Elysia } from "elysia";

export default (app: Elysia) => app.get("/", () => "Hello World");
```

## Strict Type Generation

`elysia-atlas` can automatically generate a type definition file that aggregates all your route types. This ensures your main `App` type includes every route defined in your file system, enabling full type safety for [Eden](https://elysiajs.com/eden/overview.html) clients.

### Configuration

Enable `typegen` in the plugin options:

```typescript
const app = new Elysia()
    .use(await autoload({
        typegen: true // Generates routes.d.ts in the parent of the routes dir
    }))
```

### Usage

The generated `routes.d.ts` allows you to cast your app to include all autoloaded routes.

```typescript
import { Elysia } from "elysia";
import { autoload } from "elysia-atlas";
import type { AutoloadedRoutes } from "./routes"; // Generated file

const app = new Elysia()
    .use(await autoload<AutoloadedRoutes>({ typegen: true }));

export type App = typeof app;
```

Now `App` contains the type definitions for every route in your `routes` directory.

## Routing Patterns

Files are mapped to routes based on their path relative to the `dir` option.

| File Path | Route Path |
| --- | --- |
| `routes/index.ts` | `/` |
| `routes/users.ts` | `/users` |
| `routes/posts/index.ts` | `/posts` |
| `routes/settings/profile.ts` | `/settings/profile` |

## Intercepts

Define an `intercept.ts` file in any route directory to intercept all routes in that directory and its subdirectories. Intercept files export a default function that receives an Elysia instance, just like route files.

Intercepts are ideal for applying authentication checks, logging, or any logic that should run before handling requests for a group of routes.

### Basic Usage

```
routes/
├── intercept.ts        ← applies to ALL routes
├── index.ts
├── users.ts
└── admin/
    ├── intercept.ts    ← applies to /admin/* routes (stacks on root intercept)
    ├── settings.ts
    └── analytics/
        └── overview.ts
```

```typescript
// routes/intercept.ts — root-level intercept (logging, headers, etc.)
import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
    app.onBeforeHandle(({ set }) => {
        set.headers["X-Request-Time"] = new Date().toISOString();
    });
```

```typescript
// routes/admin/intercept.ts — auth check for admin routes
import type { Elysia } from "elysia";

export default <T extends Elysia>(app: T) =>
    app.onBeforeHandle(({ headers, set }) => {
        if (!headers.authorization) {
            set.status = 401;
            return { error: "Unauthorized" };
        }
    });
```

### How It Works

- **Intercept files are not registered as routes** — `intercept.ts` is excluded from both route loading and type generation.
- **Intercepts stack from parent to child** — a route at `admin/settings.ts` receives the root `intercept.ts` first, then `admin/intercept.ts`.
- **Same export pattern as routes** — the default export receives an Elysia app instance and returns it with hooks applied.

## Options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| dir | string | "./routes" | Path to the directory containing your routes |
| prefix | string | "/" | Prefix to prepend to all autoloaded routes |
| typegen | boolean \| string | false | If true, generates `routes.d.ts`. If string, specifies the output path. |
