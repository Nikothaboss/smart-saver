import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/users/[id]/goals/route";
import db from "@/lib/db/db";

const prisma = db;

describe("GET /api/users/:id/goals", () => {
  it("should return a list of goals for the user", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found — seed a user first.");

    const req = new Request(`http://localhost/api/users/${user.id}/goals`);

    const res = await GET(req, { params: { id: user.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    if (json.length > 0) {
      expect(json[0]).toHaveProperty("title");
      expect(json[0]).toHaveProperty("targetAmount");
    }
  });
});
