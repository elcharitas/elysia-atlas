import type { BaseApp } from "../base";

export default (app: BaseApp) => app.get("/", () => "Hello from Example!");
