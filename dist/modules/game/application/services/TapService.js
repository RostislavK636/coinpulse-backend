"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapService = void 0;
const AppError_1 = require("../../../../shared/errors/AppError");
const EnergyService_1 = require("./EnergyService");
const UserRepository_1 = require("../../../users/infrastructure/repositories/UserRepository");
class TapService {
    userRepository;
    energyService;
    constructor(userRepository = new UserRepository_1.UserRepository(), energyService = new EnergyService_1.EnergyService(userRepository)) {
        this.userRepository = userRepository;
        this.energyService = energyService;
    }
    async tap(telegramId) {
        const user = await this.userRepository.findByTelegramId(telegramId);
        if (!user) {
            throw AppError_1.appError.notFound("User not found");
        }
        const userWithRestoredEnergy = await this.energyService.restoreEnergy(user);
        if (userWithRestoredEnergy.energy <= 0) {
            throw AppError_1.appError.validation("No energy");
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
exports.TapService = TapService;
