import { appError } from "../../../../shared/errors/AppError";
import { TaskRepository } from "../../infrastructure/repositories/TaskRepository";

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  async listTasks() {
    const tasks = await this.repository.listTasks();
    return tasks.map((item) => ({
      ...item,
      description: "Task description",
      category: "social",
      status: "available",
    }));
  }

  async claimTask(userId: string, taskId: string) {
    const task = await this.repository.claimTask(userId, taskId);
    if (!task) {
      throw appError.notFound("Task not found");
    }

    return {
      taskId: task.id,
      claimed: true,
      rewardAmount: task.reward,
      balanceAfter: task.reward,
    };
  }
}
