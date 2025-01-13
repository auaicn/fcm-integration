import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmServiceService } from './fcm-service/fcm-service.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FcmServiceService],
})
export class AppModule {}
