// tests/setup/vitest.setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { connect, closeDatabase, clearDatabase } from "./mongo-memory";

beforeAll(async () => { await connect(); });
afterEach(async () => { await clearDatabase(); });
afterAll(async () => { await closeDatabase(); });
