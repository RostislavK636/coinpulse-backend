import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Error handling (integration)", () => {
  it("returns standardized 404 error payload for unknown routes", async () => {
    const app = createApp();

    const res = await request(app).get("/api/v1/unknown-route");

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "NOT_FOUND",
          message: expect.any(String),
          requestId: expect.any(String),
        }),
      }),
    );
  });

  it("returns standardized 500 payload for unhandled exception", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/api/v1/test/trigger-unhandled-error")
      .set("Authorization", "Bearer valid-access-token");

    expect(res.status).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "INTERNAL_ERROR",
          message: expect.any(String),
          requestId: expect.any(String),
        }),
      }),
    );
  });

  it("returns 429 response when rate limit is exceeded", async () => {
    const app = createApp();

    const responses = await Promise.all(
      Array.from({ length: 25 }).map(() =>
        request(app)
          .post("/api/v1/auth/telegram")
          .send({
            initData:
              "query_id=AAH0&user=%7B%22id%22%3A1%7D&auth_date=1731000000&hash=valid_hash",
            device: { platform: "web" },
          }),
      ),
    );

    const hasRateLimitError = responses.some((r) => r.status === 429);
    expect(hasRateLimitError).toBe(true);
  });
});
