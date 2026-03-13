import { appError } from "../../../../shared/errors/AppError";
import { EnergyService } from "./EnergyService";
import { UserRepository } from "../../../users/infrastructure/repositories/UserRepository";

export class TapService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly energyService = new EnergyService(userRepository),
  ) {}

  async tap(telegramId: bigint) {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      throw appError.notFound("User not found");
    }

    const userWithRestoredEnergy = await this.energyService.restoreEnergy(user);

    if (userWithRestoredEnergy.energy <= 0) {
      throw appError.validation("No energy");
    }

    const updated = await this.userRepository.updateBalanceAndEnergy({
      id: userWithRestoredEnergy.id,
      balance: userWithRestoredEnergy.balance + 1,
      energy: userWithRestoredEnergy.energy - 1,
    });

    return {
      balance: updated.balance,
      energy: updated.energy,
    };
  }
}
