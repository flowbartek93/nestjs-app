import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrontTaskStatusException } from './exceptions/wrong-task.status.exception';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  ///!! SPRWADZ TE RE CZY FAKTYCZNIE DZIALAJA

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOrFail(params.id);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updatedTask: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOrFail(params.id);

    try {
      return await this.tasksService.updateTask(task, updatedTask);
    } catch (err) {
      if (err instanceof WrontTaskStatusException) {
        throw new BadRequestException('Wrong task status transition');
      }

      throw err;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOrFail(params.id);

    this.tasksService.deleteTask(task);
  }

  @Post()
  public createTask(@Body() data: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(data);
  }

  private async findOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }
}
