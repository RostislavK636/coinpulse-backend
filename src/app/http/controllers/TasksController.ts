import type { NextFunction, Request, Response } from "express";
import { TaskService } from "../../../modules/tasks/application/services/TaskService";

export class TasksController {
  constructor(private readonly taskService = new TaskService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.listTasks();
      res.status(200).json({
        success: true,
        data: { tasks },
        meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
      });
    } catch (error) {
      next(error);
    }
  };

  claim = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authUserId ?? "user-1";
      const taskId = Array.isArray(req.params.taskId)
        ? req.params.taskId[0]
        : req.params.taskId;
      const data = await this.taskService.claimTask(userId, taskId);

      res.status(200).json({
        success: true,
        data,
        meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
      });
    } catch (error) {
      next(error);
    }
  };
}
