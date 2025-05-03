import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/users/[id]/route";
import { testUserId } from "@/tests/utils";
import { NextRequest } from "next/server";

describe("GET /api/users/:id", () => {
  const userId = testUserId; // Replace with a real seeded ID

  it("should return the user with related data", async () => {
    const req = new NextRequest(`http://localhost:3000/api/users/${userId}`);
    const res = await GET(req, { params: { id: userId } });
    const json = await res.json();
    console.log("Response JSON:", json);

    expect(res.status).toBe(200);
    expect(json.id).toBe(userId);
    expect(Array.isArray(json.accounts)).toBe(true);
    expect(Array.isArray(json.goals)).toBe(true);
    expect(Array.isArray(json.rewards)).toBe(true);
  });

  it("should return 200 with null if user does not exist", async () => {
    const req = new NextRequest(`http://localhost/api/users/does-not-exist`);
    const res = await GET(req, { params: { id: "does-not-exist" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toBeNull();
  });
});
