import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  public findAll() {
    return ['A', 'B'];
  }

  @Get('/:id')
  public findOne(@Param('id') id: string) {
    return `the number is ${id}`;
  }
}
