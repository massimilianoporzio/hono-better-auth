import { Hono } from "hono";
import { authMiddleware } from "@/middlewares/auth/auth.middleware";
import { getTodosByUserId, insertTodo } from "@/db/queries";
import { HonoEnv } from "@/types";
import { createTodoValidator } from "@/validators/todos/create-todo.validator";

export const todosRoutes = new Hono<HonoEnv>();
todosRoutes.use(authMiddleware);
todosRoutes.get("/", async (c) => {
  const user = c.get("user");
  try {
    const todos = await getTodosByUserId(user!.id); // Ensure user is defined (middleware guarantees this)
    return c.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

todosRoutes.post("/", createTodoValidator, async (c) => {
  const user = c.get("user");
  const todoData = c.req.valid("json");
  try {
    const newTodo = await insertTodo({
      ...todoData,
      userId: user!.id, // Ensure user is defined (middleware guarantees this)
    });
    return c.json(newTodo, 201);
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json({ error: "Failed to create todo" }, 500);
  }
});
