import { appError } from "../../../../shared/errors/AppError";
export class GameTapService {
    async applyTap(input) {
        if (input.taps <= 0) {
            throw appError.validation("taps must be positive");
        }
        if (input.taps > 1000) {
            throw appError.antiCheat();
        }
        const availableByEnergy = Math.floor(input.currentState.energy / input.currentState.energyPerTap);
        const acceptedTaps = Math.max(0, Math.min(input.taps, availableByEnergy));
        const rejectedTaps = Math.max(0, input.taps - acceptedTaps);
        const deltaEnergy = -(acceptedTaps * input.currentState.energyPerTap);
        const deltaBalance = acceptedTaps * input.currentState.tapValue;
        const nextState = {
            ...input.currentState,
            energy: Math.max(0, input.currentState.energy + deltaEnergy),
            balance: input.currentState.balance + deltaBalance,
        };
        return {
            acceptedTaps,
            rejectedTaps,
            deltaBalance,
            deltaEnergy,
            state: nextState,
            antiCheatRisk: input.taps > 40 ? "medium" : "low",
        };
    }
}
