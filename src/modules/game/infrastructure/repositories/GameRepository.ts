export type GameState = {
  balance: number;
  energy: number;
  maxEnergy: number;
  tapValue: number;
  energyPerTap: number;
};

const defaultState: GameState = {
  balance: 0,
  energy: 100,
  maxEnergy: 100,
  tapValue: 1,
  energyPerTap: 1,
};

const states = new Map<string, GameState>();

export class GameRepository {
  async getState(userId: string): Promise<GameState> {
    return states.get(userId) ?? { ...defaultState };
  }

  async saveState(userId: string, state: GameState): Promise<void> {
    states.set(userId, state);
  }
}
