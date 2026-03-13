import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("User state API (integration)", () => {
  it("GET /me returns user state and POST /tap updates balance/energy", async () => {
    const app = createApp();
    const telegramId = Date.now() + 123;

    const registerRes = await request(app).post("/register").send({
      telegram_id: telegramId,
      username: "state_user",
    });

    expect(registerRes.status).toBe(200);

    const meBefore = await request(app).get(`/me?telegram_id=${telegramId}`);
    expect(meBefore.status).toBe(200);
    expect(meBefore.body).toEqual(
      expect.objectContaining({
        telegram_id: telegramId,
        username: "state_user",
        balance: expect.any(Number),
        energy: expect.any(Number),
      }),
    );

    const tapRes = await request(app)
      .post("/tap")
      .send({ telegram_id: telegramId });
    expect(tapRes.status).toBe(200);
    expect(tapRes.body).toEqual(
      expect.objectContaining({
        balance: meBefore.body.balance + 1,
        energy: meBefore.body.energy - 1,
      }),
    );
  });

  it("returns 400 when telegram_id is missing", async () => {
    const app = createApp();

    const meRes = await request(app).get("/me");
    expect(meRes.status).toBe(400);

    const tapRes = await request(app).post("/tap").send({});
    expect(tapRes.status).toBe(400);
  });
});
