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
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrontTaskStatusException } from './exceptions/wrong-task.status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './ create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':id/labels')
  async addLabels(
    @Param() { id }: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOrFail(id);

    return await this.tasksService.addLabels(task, labels);
  }

  @Get()
  public async findAll(
    @Query('filters') filters: FindTaskParams,
    @Query('pagination') pagination: PaginationParams,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);

    return {
      data: items,
      meta: {
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      },
    };
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

  @Delete(':id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLabels(
    @Param() { id }: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOrFail(id);
    await this.tasksService.removeLabels(task, labelNames);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOrFail(params.id);

    await this.tasksService.deleteTask(task);
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
