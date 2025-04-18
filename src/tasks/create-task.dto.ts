import { TaskStatus } from './task.model';

export class CreateTaskDto {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}
