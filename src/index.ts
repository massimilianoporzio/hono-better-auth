import { Hono } from "hono";
import { auth } from "./lib/auth";
import { todosRoutes } from "./routes/todos/todos.routes";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "http://localhost:3000", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app
  .on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))
  .route("api/todos", todosRoutes)
  .get("/", (c) => {
    return c.text("Hello Hono!");
  });

export default app;
