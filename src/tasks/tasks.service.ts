import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrontTaskStatusException } from './exceptions/wrong-task.status.exception';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  findAll(): ITask[] {
    return this.tasks;
  }

  findOne(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(task: CreateTaskDto): ITask {
    const newTask: ITask = {
      id: randomUUID(),
      description: task.description,
      status: task.status,
      title: task.title,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTask(task: ITask, updateTaskTo: UpdateTaskDto) {
    if (
      updateTaskTo.status &&
      !this.isValidStatusTransition(task.status, updateTaskTo.status)
    ) {
      throw new WrontTaskStatusException();
    }
    Object.assign(task, updateTaskTo);

    return task;
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ) {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }
}
