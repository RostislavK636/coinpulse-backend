"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const AppError_1 = require("../../../../shared/errors/AppError");
const TaskRepository_1 = require("../../infrastructure/repositories/TaskRepository");
class TaskService {
    repository;
    constructor(repository = new TaskRepository_1.TaskRepository()) {
        this.repository = repository;
    }
    async listTasks() {
        const tasks = await this.repository.listTasks();
        return tasks.map((item) => ({
            ...item,
            description: "Task description",
            category: "social",
            status: "available",
        }));
    }
    async claimTask(userId, taskId) {
        const task = await this.repository.claimTask(userId, taskId);
        if (!task) {
            throw AppError_1.appError.notFound("Task not found");
        }
        return {
            taskId: task.id,
            claimed: true,
            rewardAmount: task.reward,
            balanceAfter: task.reward,
        };
    }
}
exports.TaskService = TaskService;
