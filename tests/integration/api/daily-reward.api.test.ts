import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Daily reward API (integration)", () => {
  it("POST /daily allows only one reward per day", async () => {
    const app = createApp();
    const telegramId = Date.now() + 5000;

    await request(app).post("/register").send({
      telegram_id: telegramId,
      username: "daily_user",
    });

    const first = await request(app).post("/daily").send({
      telegram_id: telegramId,
    });

    expect(first.status).toBe(200);
    expect(first.body).toEqual(
      expect.objectContaining({
        reward: 100,
        balance: expect.any(Number),
      }),
    );

    const second = await request(app).post("/daily").send({
      telegram_id: telegramId,
    });

    expect(second.status).toBe(400);
  });
});
