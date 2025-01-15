/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FcmService } from './fcm.service';
import {
  SendMessageTokenDto,
  SendMessageTopicDto,
  SendMessageConditionDto,
} from 'src/fcm.dto';

@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('send/token')
  async sendToToken(@Body() body: SendMessageTokenDto) {
    const { token, notification, uid, data } = body;
    return await this.fcmService.send({
      token,
      notification,
      uid,
      data,
    });
  }

  @Post('send/topic')
  async sendToTopic(@Body() body: SendMessageTopicDto) {
    const { topic, notification, uid, data } = body;
    return await this.fcmService.send({
      topic,
      notification,
      uid,
      data,
    });
  }

  @Post('send/condition')
  async sendToCondition(@Body() body: SendMessageConditionDto) {
    const { condition, notification, uid, data } = body;
    return await this.fcmService.send({
      condition,
      notification,
      uid,
      data,
    });
  }

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
}
