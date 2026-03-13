import type { NextFunction, Request, Response } from "express";
import { EnergyService } from "../../../modules/game/application/services/EnergyService";
import { TapService } from "../../../modules/game/application/services/TapService";
import { UserRepository } from "../../../modules/users/infrastructure/repositories/UserRepository";
import { appError } from "../../../shared/errors/AppError";

function getTelegramId(req: Request) {
  const value = (req as Request & { telegramId?: bigint }).telegramId;
  if (!value) {
    throw appError.validation("telegram_id is required", [
      { field: "telegram_id", reason: "must be provided" },
    ]);
  }
  return value;
}

export class UserController {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly energyService = new EnergyService(userRepository),
    private readonly tapService = new TapService(),
  ) {}

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const telegramId = getTelegramId(req);
      const user = await this.userRepository.findByTelegramId(telegramId);

      if (!user) {
        throw appError.notFound("User not found");
      }

      const userWithRestoredEnergy =
        await this.energyService.restoreEnergy(user);

      res.status(200).json({
        success: true,
        data: {
          telegram_id: Number(userWithRestoredEnergy.telegram_id),
          username: userWithRestoredEnergy.username,
          balance: userWithRestoredEnergy.balance,
          energy: userWithRestoredEnergy.energy,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  tap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const telegramId = getTelegramId(req);
      const result = await this.tapService.tap(telegramId);

      res.status(200).json({
        success: true,
        data: {
          balance: result.balance,
          energy: result.energy,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  daily = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const telegramId = getTelegramId(req);
      const user = await this.userRepository.findByTelegramId(telegramId);

      if (!user) {
        throw appError.notFound("User not found");
      }

      const now = new Date();
      const alreadyClaimedToday =
        user.lastDailyReward !== null &&
        user.lastDailyReward.toDateString() === now.toDateString();

      if (alreadyClaimedToday) {
        throw appError.validation("Daily reward already claimed");
      }

      const reward = 100;
      const updated = await this.userRepository.applyDailyReward({
        id: user.id,
        balance: user.balance + reward,
        lastDailyReward: now,
      });

      res.status(200).json({
        success: true,
        data: {
          reward,
          balance: updated.balance,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
