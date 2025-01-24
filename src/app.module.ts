import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmController } from './fcm/fcm.controller';
import { FcmService } from './fcm/fcm.service';
import { MessageBuilder } from './fcm/message.builder';
import { BgLogController } from './bg-log/bg-log.controller';

@Module({
  imports: [],
  controllers: [AppController, FcmController, BgLogController],
  providers: [AppService, FcmService, MessageBuilder],
})
export class AppModule {}
