// tests/unit/auth.spec.ts
import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";

describe("auth helpers", () => {
  it("firma y verifica un JWT", () => {
    const secret = "testsecret";
    const token = jwt.sign({ userId: "123" }, secret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, secret) as any;
    expect(decoded.userId).toBe("123");
  });
});
