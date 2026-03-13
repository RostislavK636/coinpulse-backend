import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app/bootstrap/createApp";

describe("API edge cases (integration)", () => {
  it("POST /api/v1/game/tap with negative taps returns 400 validation error", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/game/tap")
      .set("Authorization", "Bearer valid-access-token")
      .set("Idempotency-Key", "tap-negative")
      .send({ taps: -5, clientTs: Date.now(), nonce: "edge-1" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/game/tap without Idempotency-Key returns 400", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/game/tap")
      .set("Authorization", "Bearer valid-access-token")
      .send({ taps: 1, clientTs: Date.now(), nonce: "edge-2" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/wallet/withdraw above daily limit returns 422", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/v1/wallet/withdraw")
      .set("Authorization", "Bearer valid-access-token")
      .set("Idempotency-Key", "withdraw-limit")
      .send({
        amount: 1000000,
        network: "TON",
        address: "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("WITHDRAWAL_LIMIT");
  });
});
