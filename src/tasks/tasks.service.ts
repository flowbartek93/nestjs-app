import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';

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

  updateTask(task: ITask, body: UpdateTaskDto) {
    // const properTask = this.findOne(id);

    // if (!properTask) {
    //   throw new Error('Task not found');
    // }

    // const updatedTask = { ...properTask, ...body };

    // this.tasks = this.tasks.map((task) => {
    //   if (task.id === id) {
    //     return updatedTask;
    //   }

    //   return task;
    // });

    Object.assign(task, body);

    return task;
  }
}
