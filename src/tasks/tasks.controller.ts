import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  ///!! SPRWADZ TE RE CZY FAKTYCZNIE DZIALAJA

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): ITask {
    return this.findOrFail(params.id);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param() params: FindOneParams,
    @Body() body: UpdateTaskStatusDto,
  ): ITask {
    const task = this.findOrFail(params.id);

    task.status = body.status;

    return task;
  }

  @Post()
  public createTask(@Body() data: CreateTaskDto): ITask {
    return this.tasksService.createTask(data);
  }

  private findOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }
}
