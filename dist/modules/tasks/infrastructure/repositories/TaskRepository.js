"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const tasks = [
    { id: "join-telegram", title: "Join Telegram channel", reward: 150 },
    { id: "visit-site", title: "Visit website", reward: 100 },
    { id: "follow-twitter", title: "Follow Twitter", reward: 120 },
];
const claimedByUser = new Map();
class TaskRepository {
    async listTasks() {
        return tasks;
    }
    async claimTask(userId, taskId) {
        const task = tasks.find((item) => item.id === taskId);
        if (!task) {
            return null;
        }
        const claimed = claimedByUser.get(userId) ?? new Set();
        claimed.add(taskId);
        claimedByUser.set(userId, claimed);
        return task;
    }
}
exports.TaskRepository = TaskRepository;
