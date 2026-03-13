import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Register API (integration)", () => {
  it("POST /register creates user and repeated call does not create duplicate", async () => {
    const app = createApp();
    const telegramId = Date.now();

    const firstResponse = await request(app).post("/register").send({
      telegram_id: telegramId,
      username: "coinpulse_user",
    });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.success).toBe(true);
    expect(firstResponse.body.data.user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        telegram_id: telegramId,
        username: "coinpulse_user",
        created_at: expect.any(String),
      }),
    );

    const secondResponse = await request(app).post("/register").send({
      telegram_id: telegramId,
      username: "coinpulse_user_updated",
    });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.success).toBe(true);
    expect(secondResponse.body.data.user.id).toBe(
      firstResponse.body.data.user.id,
    );
    expect(secondResponse.body.data.user.telegram_id).toBe(telegramId);
  });
});
