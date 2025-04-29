import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    const prefix = this.configService.get('app.messagePrefix');
    return this.logger.log(`hello world !!! ${prefix} `);
  }
}
