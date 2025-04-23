import { PartialType } from '@nestjs/swagger';
import { TaskStatus } from './task.model';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
