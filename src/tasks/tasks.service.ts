import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';

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
      id: Math.random().toString(36).substring(2, 15),
      description: task.description,
      status: task.status,
      title: task.title,
    };

    this.tasks.push(newTask);
    return newTask;
  }
}
