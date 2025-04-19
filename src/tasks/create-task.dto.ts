import { TaskStatus } from './task.model';


import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  
  @IsNotEmpty()
  @IsString()
  id?: string;

  
  @IsNotEmpty()
  @IsString()
  title: string;

  
  @IsNotEmpty()
  @IsString()
  description: string;


  @IsEnum(TaskStatus)
  status: TaskStatus;

}
