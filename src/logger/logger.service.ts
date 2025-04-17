import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(private readonly msgSrv: MessageFormatterService) {}

  log(msg: string) {
    return this.msgSrv.format(msg);
  }
}
