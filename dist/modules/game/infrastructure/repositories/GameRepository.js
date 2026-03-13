"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
const defaultState = {
    balance: 0,
    energy: 100,
    maxEnergy: 100,
    tapValue: 1,
    energyPerTap: 1,
};
const states = new Map();
class GameRepository {
    async getState(userId) {
        return states.get(userId) ?? { ...defaultState };
    }
    async saveState(userId, state) {
        states.set(userId, state);
    }
}
exports.GameRepository = GameRepository;
