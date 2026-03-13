import { UserRepository } from "../../../users/infrastructure/repositories/UserRepository";
export class EnergyService {
    userRepository;
    constructor(userRepository = new UserRepository()) {
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
