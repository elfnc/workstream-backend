import { describe, expect, it } from "bun:test";
import { app } from "../app";

describe("Auth Module", () => {
  it("should return 400 for invalid login payload", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin" }) // missing password
      })
    );
    expect(response.status).toBe(422);
  });

  it("should fail login with incorrect credentials", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "wrong", password: "wrong" })
      })
    );
    // Since we throw specific errors, the error handler formats it
    expect(response.status).toBe(401);
  });
});
