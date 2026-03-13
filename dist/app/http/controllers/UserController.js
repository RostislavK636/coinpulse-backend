"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const EnergyService_1 = require("../../../modules/game/application/services/EnergyService");
const TapService_1 = require("../../../modules/game/application/services/TapService");
const UserRepository_1 = require("../../../modules/users/infrastructure/repositories/UserRepository");
const AppError_1 = require("../../../shared/errors/AppError");
function getTelegramId(req) {
    const value = req.telegramId;
    if (!value) {
        throw AppError_1.appError.validation("telegram_id is required", [
            { field: "telegram_id", reason: "must be provided" },
        ]);
    }
    return value;
}
class UserController {
    userRepository;
    energyService;
    tapService;
    constructor(userRepository = new UserRepository_1.UserRepository(), energyService = new EnergyService_1.EnergyService(userRepository), tapService = new TapService_1.TapService()) {
        this.userRepository = userRepository;
        this.energyService = energyService;
        this.tapService = tapService;
    }
    me = async (req, res, next) => {
        try {
            const telegramId = getTelegramId(req);
            const user = await this.userRepository.findByTelegramId(telegramId);
            if (!user) {
                throw AppError_1.appError.notFound("User not found");
            }
            const userWithRestoredEnergy = await this.energyService.restoreEnergy(user);
            res.status(200).json({
                success: true,
                data: {
                    telegram_id: Number(userWithRestoredEnergy.telegram_id),
                    username: userWithRestoredEnergy.username,
                    balance: userWithRestoredEnergy.balance,
                    energy: userWithRestoredEnergy.energy,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    tap = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    daily = async (req, res, next) => {
        try {
            const telegramId = getTelegramId(req);
            const user = await this.userRepository.findByTelegramId(telegramId);
            if (!user) {
                throw AppError_1.appError.notFound("User not found");
            }
            const now = new Date();
            const alreadyClaimedToday = user.lastDailyReward !== null &&
                user.lastDailyReward.toDateString() === now.toDateString();
            if (alreadyClaimedToday) {
                throw AppError_1.appError.validation("Daily reward already claimed");
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
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
