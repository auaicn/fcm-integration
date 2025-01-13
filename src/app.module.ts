import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmController } from './fcm/fcm.controller';
import { FcmService } from './fcm/fcm.service';

@Module({
  imports: [],
  controllers: [AppController, FcmController],
  providers: [AppService, FcmService],
})
export class AppModule {}
