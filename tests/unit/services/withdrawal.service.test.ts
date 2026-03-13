import { describe, expect, it } from "vitest";
import { WithdrawalService } from "../../../src/modules/wallet/application/services/WithdrawalService";

describe("WithdrawalService (unit)", () => {
  it("creates pending withdrawal when balance is enough", async () => {
    const service = new WithdrawalService();

    const result = await service.createWithdrawal({
      userId: "user-1",
      amount: 100,
      availableBalance: 500,
      network: "TON",
      address: "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    });

    expect(result.status).toBe("pending");
    expect(result.amount).toBe(100);
    expect(result.fee).toBeGreaterThanOrEqual(0);
    expect(result.netAmount).toBeLessThanOrEqual(100);
  });

  it("throws insufficient funds error", async () => {
    const service = new WithdrawalService();

    await expect(
      service.createWithdrawal({
        userId: "user-2",
        amount: 200,
        availableBalance: 150,
        network: "TON",
        address: "UQBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      }),
    ).rejects.toMatchObject({
      code: "INSUFFICIENT_FUNDS",
    });
  });

  it("throws validation error for invalid wallet address", async () => {
    const service = new WithdrawalService();

    await expect(
      service.createWithdrawal({
        userId: "user-3",
        amount: 50,
        availableBalance: 1000,
        network: "TON",
        address: "invalid-address",
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });
});
