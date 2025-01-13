import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmServiceService } from './fcm-service/fcm-service.service';
import { FcmServiceController } from './fcm-service/fcm-service.controller';

@Module({
  imports: [],
  controllers: [AppController, FcmServiceController],
  providers: [AppService, FcmServiceService],
})
export class AppModule {}
