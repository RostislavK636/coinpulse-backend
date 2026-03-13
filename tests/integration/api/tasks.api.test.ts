import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Tasks API (integration)", () => {
  it("GET /api/v1/tasks returns task list for authorized user", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", "Bearer valid-access-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.tasks)).toBe(true);
  });

  it("POST /api/v1/tasks/:taskId/claim returns reward payload", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/tasks/join-telegram/claim")
      .set("Authorization", "Bearer valid-access-token")
      .set("Idempotency-Key", "claim-join-telegram-1")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        taskId: "join-telegram",
        claimed: true,
        rewardAmount: expect.any(Number),
        balanceAfter: expect.any(Number),
      }),
    );
  });
});
