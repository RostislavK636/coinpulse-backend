import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Authentication API (integration)", () => {
  it("POST /api/v1/auth/telegram returns tokens for valid Telegram initData", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/auth/telegram")
      .send({
        initData:
          "query_id=AAH0&user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Rostislav%22%7D&auth_date=1731000000&hash=valid_hash",
        device: {
          platform: "web",
          userAgent: "vitest",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toEqual(expect.any(String));
    expect(res.body.data.tokens.refreshToken).toEqual(expect.any(String));
  });

  it("GET /api/v1/game/state without token returns 401", async () => {
    const app = createApp();

    const res = await request(app).get("/api/v1/game/state");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/v1/auth/refresh rotates session tokens", async () => {
    const app = createApp();

    const res = await request(app).post("/api/v1/auth/refresh").send({
      refreshToken: "valid-refresh-token",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toEqual(expect.any(String));
    expect(res.body.data.tokens.refreshToken).toEqual(expect.any(String));
  });
});
