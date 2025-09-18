// tests/unit/validators.spec.ts
import { describe, it, expect } from "vitest";
import { reviewCreateSchema } from "@/lib/validators";

describe("validators", () => {
  it("review válida", () => {
    const res = reviewCreateSchema.safeParse({ bookId: "x", rating: 4, comment: "ok" });
    expect(res.success).toBe(true);
  });
  it("rating inválido", () => {
    const res = reviewCreateSchema.safeParse({ bookId: "x", rating: 10 });
    expect(res.success).toBe(false);
  });
});
