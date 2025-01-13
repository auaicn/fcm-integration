import { Controller, Get } from '@nestjs/common';
import { FcmService } from './fcm.service';

@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Get('test')
  testFcm() {
    return this.fcmService.sendTestNotification();
  }
}
