import { Controller, Get, Query } from '@nestjs/common';
import { FcmService } from './fcm.service';
import * as admin from 'firebase-admin';

@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Get('subscribe')
  async subscribeToTopic(
    @Query('tokens') tokens: string, // Comma-separated tokens
    @Query('topic') topic: string,
  ) {
    const tokenArray = tokens.split(','); // Convert comma-separated tokens into an array
    await this.fcmService.subscribeToTopic(tokenArray, topic);
    return { message: `Subscribed to topic ${topic}` };
  }

  @Get('unsubscribe')
  async unsubscribeFromTopic(
    @Query('tokens') tokens: string, // Comma-separated tokens
    @Query('topic') topic: string,
  ) {
    const tokenArray = tokens.split(','); // Convert comma-separated tokens into an array
    await this.fcmService.unsubscribeFromTopic(tokenArray, topic);
    return { message: `Unsubscribed from topic ${topic}` };
  }

  @Get('send-to-device')
  async sendToDevice(
    @Query('token') token: string,
    @Query('title') title: string,
    @Query('body') body: string,
  ) {
    // Constructing the message object for device
    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      token: token, // Sending message to the device token
    };

    await this.fcmService.sendMessage(message);
    return { message: `Message sent to device token ${token}` };
  }

  @Get('send-to-topic')
  async sendToTopic(
    @Query('topic') topic: string,
    @Query('title') title: string,
    @Query('body') body: string,
  ) {
    // Constructing the message object for topic
    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      topic: topic, // Sending message to the topic
    };

    await this.fcmService.sendMessage(message);
    return { message: `Message sent to topic ${topic}` };
  }
}
