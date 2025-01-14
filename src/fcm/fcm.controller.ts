/* eslint-disable @typescript-eslint/no-unused-vars */
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

  generateMessageTitle = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
      return "Good Morning! Here's your update 🌅";
    } else if (hours >= 12 && hours < 18) {
      return 'Good Afternoon! New updates for you ☀️';
    } else if (hours >= 18 && hours < 22) {
      return "Good Evening! Here's what's new 🌆";
    } else {
      return 'Late Night Update 🌙';
    }
  };

  @Get('send-to-device')
  async sendToDevice(@Query('token') token: string) {
    const EXAMPLE_CONTENT_SHORT =
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';

    const EXAMPLE_CONTENT_LONG = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

    const EXAMPLE_DATA = {
      hospitalId: '22',
      chatRoomId: '19299',
      messageId: '100020',
    };

    const EXAMPLE_TITLE = this.generateMessageTitle();

    await this.fcmService.sendMessage({
      token,
      notification_title: EXAMPLE_TITLE,
      notification_content: EXAMPLE_CONTENT_LONG,
      serverMessageId: 'auaicn',
      data: EXAMPLE_DATA,
    });

    return { message: `Message sent to device token ${token}` };
  }
}
