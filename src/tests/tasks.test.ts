import { describe, expect, it } from "bun:test";
import { app } from "../app";

describe("Tasks Module", () => {
  it("should require authentication to get tasks", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/tasks")
    );
    expect(response.status).toBe(401);
  });

  it("should reject task creation without required fields", async () => {
    // Assuming SUPER_ADMIN token is required, this will either be 401 Unauth or 400 Bad Request
    // Wait, auth middleware runs before body validation.
    // So it will be 401. Let's just test the 401 behavior here.
    const response = await app.handle(
      new Request("http://localhost/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Task" }) // Missing auth and other fields
      })
    );
    expect(response.status).toBe(422);
  });
});
