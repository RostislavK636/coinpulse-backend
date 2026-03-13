import { describe, expect, it } from "vitest";
import { GameTapService } from "../../../src/modules/game/application/services/GameTapService";

describe("GameTapService (unit)", () => {
  it("applies tap and decreases energy when enough energy exists", async () => {
    const service = new GameTapService();

    const result = await service.applyTap({
      userId: "user-1",
      taps: 3,
      currentState: {
        balance: 10,
        energy: 20,
        maxEnergy: 100,
        tapValue: 2,
        energyPerTap: 1,
      },
    });

    expect(result.deltaBalance).toBe(6);
    expect(result.deltaEnergy).toBe(-3);
    expect(result.state.balance).toBe(16);
    expect(result.state.energy).toBe(17);
  });

  it("returns rejected taps when energy is insufficient", async () => {
    const service = new GameTapService();

    const result = await service.applyTap({
      userId: "user-2",
      taps: 10,
      currentState: {
        balance: 0,
        energy: 2,
        maxEnergy: 100,
        tapValue: 1,
        energyPerTap: 1,
      },
    });

    expect(result.acceptedTaps).toBe(2);
    expect(result.rejectedTaps).toBe(8);
    expect(result.state.energy).toBe(0);
  });

  it("blocks impossible tap burst as anti-cheat", async () => {
    const service = new GameTapService();

    await expect(
      service.applyTap({
        userId: "user-3",
        taps: 10000,
        currentState: {
          balance: 0,
          energy: 100,
          maxEnergy: 100,
          tapValue: 1,
          energyPerTap: 1,
        },
      }),
    ).rejects.toMatchObject({
      code: "ANTI_CHEAT_BLOCK",
    });
  });
});
