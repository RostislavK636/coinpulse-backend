const defaultState = {
    balance: 0,
    energy: 100,
    maxEnergy: 100,
    tapValue: 1,
    energyPerTap: 1,
};
const states = new Map();
export class GameRepository {
    async getState(userId) {
        return states.get(userId) ?? { ...defaultState };
    }
    async saveState(userId, state) {
        states.set(userId, state);
    }
}
