import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  format(msg: string) {
    const date = new Date().toDateString();
    return `[${date}], ${msg}`;
  }
}
