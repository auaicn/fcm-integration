import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmController } from './fcm/fcm.controller';
import { FcmService } from './fcm/fcm.service';
import { MessageBuilder } from './fcm/message.builder';

@Module({
  imports: [],
  controllers: [AppController, FcmController],
  providers: [AppService, FcmService, MessageBuilder],
})
export class AppModule {}
