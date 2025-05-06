import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config-files/config.types';
import { AppConfig, appConfig } from './config-files/app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.logger.log(`hello world !!! ${prefix} `);
  }
}
