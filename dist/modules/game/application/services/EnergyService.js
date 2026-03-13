"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyService = void 0;
const UserRepository_1 = require("../../../users/infrastructure/repositories/UserRepository");
class EnergyService {
    userRepository;
    constructor(userRepository = new UserRepository_1.UserRepository()) {
        this.userRepository = userRepository;
    }
    async restoreEnergy(user) {
        const now = new Date();
        const secondsSinceLastUpdate = Math.floor((now.getTime() - user.lastEnergyUpdate.getTime()) / 1000);
        const restoredUnits = Math.floor(secondsSinceLastUpdate / 10);
        if (restoredUnits <= 0) {
            return user;
        }
        const restoredEnergy = Math.min(100, user.energy + restoredUnits);
        return this.userRepository.updateEnergyState({
            id: user.id,
            energy: restoredEnergy,
            lastEnergyUpdate: now,
        });
    }
}
exports.EnergyService = EnergyService;
