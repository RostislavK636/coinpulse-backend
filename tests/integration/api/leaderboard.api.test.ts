import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Leaderboard API (integration)", () => {
  it("GET /leaderboard returns users sorted by balance desc", async () => {
    const app = createApp();

    const baseId = Date.now() + 10000;
    const runPrefix = `lb_run_${baseId}_`;

    const users = [
      { id: baseId + 1, taps: 1 },
      { id: baseId + 2, taps: 3 },
      { id: baseId + 3, taps: 2 },
    ];

    for (const user of users) {
      await request(app)
        .post("/register")
        .send({
          telegram_id: user.id,
          username: `${runPrefix}${user.id}`,
        });

      for (let i = 0; i < user.taps; i += 1) {
        await request(app).post("/tap").send({ telegram_id: user.id });
      }
    }

    const response = await request(app).get("/leaderboard");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    const balances = response.body.data.map(
      (item: { balance: number }) => item.balance,
    );
    for (let i = 1; i < balances.length; i += 1) {
      expect(balances[i - 1]).toBeGreaterThanOrEqual(balances[i]);
    }

    const filtered = response.body.data.filter((item: { username: string }) =>
      item.username?.startsWith(runPrefix),
    );

    expect(filtered.length).toBeGreaterThan(0);
  });
});
