import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { TaskStatus } from './task.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(3)
  search?: string;
}
