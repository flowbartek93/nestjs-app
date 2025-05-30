import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrontTaskStatusException } from './exceptions/wrong-task.status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './ create-task-label.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly labelRepo: Repository<TaskLabel>,
  ) {}

  private tasks: ITask[] = [];

  public async addLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    //deduplicate labels
    //get exisint names
    // new lalbels arent already existin
    // save new ones onlify if there are realy new ones

    const existingNames = new Set(task.labels.map((l) => l.name));

    const labels = this.getUniqueLabels(labelDtos)
      .filter((dto) => !existingNames.has(dto.name))
      .map((label) => this.labelRepo.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.tasksRepo.save(task);
    }

    return task;
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepo.find();
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepo.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  async createTask(createDto: CreateTaskDto): Promise<Task> {
    console.log(createDto);

    if (createDto.labels) {
      createDto.labels = this.getUniqueLabels(createDto.labels);
    }
    // await this.tasksRepo.create({});

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

    if (updateTaskTo.labels) {
      updateTaskTo.labels = this.getUniqueLabels(updateTaskTo.labels);
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

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];

    return uniqueNames.map((name) => ({ name }));
  }
}
