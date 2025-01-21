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

  @Post('token/send')
  async token$send(@Body() body: SendMessageTokenDto) {
    const { token, notification, uid, data, sound } = body;
    return await this.fcmService.send({
      token,
      notification,
      uid,
      data,
      sound,
    });
  }

  @Post('token/sendEach')
  async token$sendEach(@Body() body: SendMessageTokenDto[]) {
    return await Promise.all(
      body.map(({ token, notification, uid, data, sound }) =>
        this.fcmService.send({
          token,
          notification,
          uid,
          data,
          sound,
        }),
      ),
    );
  }

  @Post('topic/send')
  async sendToTopic(@Body() body: SendMessageTopicDto) {
    const { topic, notification, uid, data, sound } = body;
    return await this.fcmService.send({
      topic,
      notification,
      uid,
      data,
      sound,
    });
  }

  @Post('topic/sendEach')
  async topic$sendEach(@Body() body: SendMessageTopicDto[]) {
    return await Promise.all(
      body.map(({ topic, notification, uid, data, sound }) =>
        this.fcmService.send({
          topic,
          notification,
          uid,
          data,
          sound,
        }),
      ),
    );
  }

  @Post('topic_condition/send')
  async topic_condition$send(@Body() body: SendMessageConditionDto) {
    const { condition, notification, uid, data, sound } = body;
    return await this.fcmService.send({
      condition,
      notification,
      uid,
      data,
      sound,
    });
  }

  @Post('topic_condition/sendEach')
  async topic_condition$sendEach(@Body() body: SendMessageConditionDto[]) {
    return await Promise.all(
      body.map(({ condition, notification, uid, data, sound }) =>
        this.fcmService.send({
          condition,
          notification,
          uid,
          data,
          sound,
        }),
      ),
    );
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
