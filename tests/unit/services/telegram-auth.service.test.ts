import { describe, expect, it } from "vitest";
import { TelegramAuthService } from "../../../src/modules/auth/application/services/TelegramAuthService";

describe("TelegramAuthService (unit)", () => {
  it("accepts valid initData and returns authenticated user context", async () => {
    const service = new TelegramAuthService({
      botToken: "test_bot_token",
      maxAuthAgeSeconds: 60,
    });

    const result = await service.authenticate({
      initData:
        "query_id=AAGx&user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Rostislav%22%7D&auth_date=1731000000&hash=valid_hash",
      ip: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(result.user.telegramId).toBe("123456");
    expect(result.isNewUser).toBeTypeOf("boolean");
    expect(result.tokens.accessToken.length).toBeGreaterThan(20);
    expect(result.tokens.refreshToken.length).toBeGreaterThan(20);
  });

  it("rejects expired initData", async () => {
    const service = new TelegramAuthService({
      botToken: "test_bot_token",
      maxAuthAgeSeconds: 10,
    });

    await expect(
      service.authenticate({
        initData:
          "query_id=AAGx&user=%7B%22id%22%3A1%7D&auth_date=1600000000&hash=valid_hash",
        ip: "127.0.0.1",
        userAgent: "vitest",
      }),
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects malformed initData", async () => {
    const service = new TelegramAuthService({
      botToken: "test_bot_token",
      maxAuthAgeSeconds: 60,
    });

    await expect(
      service.authenticate({
        initData: "invalid_payload",
        ip: "127.0.0.1",
        userAgent: "vitest",
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });
});
