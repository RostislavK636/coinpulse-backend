import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("Game API (integration)", () => {
  it("GET /api/v1/game/state returns current game state for authorized user", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/api/v1/game/state")
      .set("Authorization", "Bearer valid-access-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
        energy: expect.any(Number),
        maxEnergy: expect.any(Number),
        tapValue: expect.any(Number),
        energyPerTap: expect.any(Number),
      }),
    );
  });

  it("POST /api/v1/game/tap applies tap and returns updated state", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/game/tap")
      .set("Authorization", "Bearer valid-access-token")
      .set("Idempotency-Key", "tap-001")
      .send({ taps: 3, clientTs: Date.now(), nonce: "nonce-1" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        acceptedTaps: expect.any(Number),
        rejectedTaps: expect.any(Number),
        deltaBalance: expect.any(Number),
        deltaEnergy: expect.any(Number),
        state: expect.any(Object),
      }),
    );
  });
});
