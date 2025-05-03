import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/users/route";
import { NextRequest } from "next/server";

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const payload = {
      name: "API Test User",
      email: `api-test-${Date.now()}@example.com`,
    };

    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data.name).toBe(payload.name);
    expect(data.email).toBe(payload.email);
  });

  it("should return 500 for invalid payload", async () => {
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toHaveProperty("error");
  });
});
