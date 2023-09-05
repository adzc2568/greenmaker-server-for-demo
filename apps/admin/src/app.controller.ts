import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorator/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('do-not-sleep')
  doNotSleep() {
    return 'do not sleep success';
  }
}
