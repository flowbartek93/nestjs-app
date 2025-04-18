export interface ITask {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN,
  IN_PROGRESS,
  DONE,
}
