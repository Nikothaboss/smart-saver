import { describe, it, expect } from "vitest";
import { DELETE, GET } from "@/app/api/users/[id]/route";
import { NextRequest } from "next/server";
import db from "@/lib/db/db";

const prisma = db;

describe("GET /api/users/:id", () => {
  it("should return the user with related data", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found — seed a user first.");
    const req = new NextRequest(`http://localhost:3000/api/users/${user.id}`);
    const res = await GET(req, { params: { id: user.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(user.id);
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

describe("DELETE /api/users/:id", () => {
  it("should delete a user by ID", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Delete Me",
        email: `api-test-${Date.now()}@example.com`,
      },
    });

    const req = new Request(`http://localhost/api/users/${user.id}`, {
      method: "DELETE",
    });

    const res = await DELETE(req, { params: { id: user.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(user.id);

    const check = await prisma.user.findUnique({ where: { id: user.id } });
    expect(check).toBeNull();
  });
});
