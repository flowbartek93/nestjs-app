import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels)
  task: Task;

  @Column()
  createdAt: Date;
}
