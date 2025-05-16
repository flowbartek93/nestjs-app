import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrontTaskStatusException } from './exceptions/wrong-task.status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
  ) {}

  private tasks: ITask[] = [];

  async findAll(): Promise<Task[]> {
    return await this.tasksRepo.find();
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepo.findOneBy({ id });
  }

  async createTask(createDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepo.save(createDto);
  }

  async deleteTask(task: Task): Promise<void> {
    await this.tasksRepo.delete(task);
  }
  async updateTask(task: Task, updateTaskTo: UpdateTaskDto): Promise<Task> {
    if (
      updateTaskTo.status &&
      !this.isValidStatusTransition(task.status, updateTaskTo.status)
    ) {
      throw new WrontTaskStatusException();
    }

    Object.assign(task, updateTaskTo);

    return await this.tasksRepo.save(task);
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
