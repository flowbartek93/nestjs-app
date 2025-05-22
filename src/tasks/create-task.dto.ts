import { TaskStatus } from './task.model';

import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
