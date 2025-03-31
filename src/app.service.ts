import { Injectable } from '@nestjs/common';
import { TestService } from './test/test.service';

@Injectable()
export class AppService {
  constructor(private readonly testSrv: TestService) {}

  getHello(): string {
    return 'Hello World!' + this.testSrv.work();
  }
}
