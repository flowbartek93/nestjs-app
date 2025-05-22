import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config-files/app.config';
import { appConfigSchema, ConfigType } from './config-files/config.types';
import { typeOrmConfig } from './config-files/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config-files/typed-config.service';
import { Task } from './tasks/task.entity';
import { User } from './users/users.entity';
import { TaskLabel } from './tasks/task-label.entity';
1;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [Task, User, TaskLabel],
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        aboutEarly: true,
      },
    }),
    TasksModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    MessageFormatterService,
    LoggerService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
