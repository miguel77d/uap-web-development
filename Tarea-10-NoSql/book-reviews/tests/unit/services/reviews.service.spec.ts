// tests/unit/services/reviews.service.spec.ts
import { describe, it, expect } from "vitest";
import User from "@/models/User";
import { createReview } from "@/services/reviews.service";
import bcrypt from "bcryptjs";

describe("reviews service", () => {
  it("crea una review para un usuario", async () => {
    const u = await User.create({ email: "a@a.com", passwordHash: await bcrypt.hash("12345678", 10) });
    const r = await createReview(String(u._id), { bookId: "GB:abc", rating: 5, comment: "Muy bueno" });
    expect(r.bookId).toBe("GB:abc");
    expect(String(r.userId)).toBe(String(u._id));
  });
});
