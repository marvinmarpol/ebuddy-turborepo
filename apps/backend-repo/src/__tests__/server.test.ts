import supertest from "supertest";
import { describe, it, expect } from "@jest/globals";
import { createServer } from "../core/app";

describe("Server", () => {
  it("health check returns 200", async () => {
    await supertest(createServer())
      .get("/status")
      .expect(200)
      .then((res) => {
        expect(res.ok).toBe(true);
      });
  });

  it("fetch user without token returns 401", async () => {
    await supertest(createServer())
      .get("/api/fetch-user-data/iQWqAB5p6a8dUeDmhoFM")
      .expect(401);
  });
});
