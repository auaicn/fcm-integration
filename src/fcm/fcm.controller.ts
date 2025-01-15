/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Query } from '@nestjs/common';
import { FcmService } from './fcm.service';
import * as admin from 'firebase-admin';
import { randomInt } from 'node:crypto';

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

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  @Get('send-to-device')
  async sendToDevice(@Query('token') token: string) {
    const EXAMPLE_TITLE = this.generateRandomString(10);

    const EXAMPLE_CONTENT_S = this.generateRandomString(10);
    const EXAMPLE_CONTENT_M = this.generateRandomString(2000);
    const EXAMPLE_CONTENT_L = this.generateRandomString(8000);

    const EXAMPLE_MESSAGE_ID = randomInt(1987654321).toString();

    const EXAMPLE_DATA = {
      hospitalId: '22',
      chatRoomId: '19299',
    };

    await this.fcmService.sendMessage({
      token,
      uid: EXAMPLE_MESSAGE_ID.toString(),
      notification: {
        title: EXAMPLE_TITLE,
        body: EXAMPLE_CONTENT_M,
      },
      data: EXAMPLE_DATA,
    });

    return { message: `Message sent to device token ${token}` };
  }
}
