import { describe, expect, it } from "bun:test";
import { app } from "../app";

describe("Dashboard Module", () => {
  it("should return 401 without auth", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/dashboard/summary")
    );
    expect(response.status).toBe(401);
  });
});
