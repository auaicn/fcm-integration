/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import { MessageBuilder } from './message.builder';
import {
  SendMessageConditionDto,
  SendMessageTokenDto,
  SendMessageTopicDto,
} from 'src/fcm.dto';

@Injectable()
export class FcmService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.messaging = admin.messaging();
  }

  async send(
    messageDto:
      | SendMessageTokenDto
      | SendMessageTopicDto
      | SendMessageConditionDto,
  ): Promise<any> {
    try {
      const messageBuilder: MessageBuilder = new MessageBuilder();

      if ('token' in messageDto) {
        messageBuilder
          .setToken(messageDto.token)
          .setData(messageDto.data)
          .setNotification(messageDto.notification)
          .setUid(messageDto.uid)
          .setSound(true)
          .setImage(messageDto.notification.imageUrl);
      } else if ('topic' in messageDto) {
        messageBuilder
          .setTopic(messageDto.topic)
          .setData(messageDto.data)
          .setNotification(messageDto.notification)
          .setUid(messageDto.uid)
          .setSound(true)
          .setImage(messageDto.notification.imageUrl);
      } else if ('condition' in messageDto) {
        messageBuilder
          .setCondition(messageDto.condition)
          .setData(messageDto.data)
          .setNotification(messageDto.notification)
          .setUid(messageDto.uid)
          .setSound(true)
          .setImage(messageDto.notification.imageUrl);
      } else {
        throw 'unknown message type';
      }

      const message = messageBuilder.build();

      const response = await admin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    try {
      await this.messaging.subscribeToTopic(tokens, topic);
      console.log(`Successfully subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    try {
      await this.messaging.unsubscribeFromTopic(tokens, topic);
      console.log(`Successfully unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }
}
