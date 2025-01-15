/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import { MessageBuilder } from './message.builder';
import {
  SendMessageConditionDto,
  SendMessageTokenDto,
  SendMessageTopicDto,
} from 'src/fcm..dto';

const EXAMPLE_IMAGE_URL_JPG =
  'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Speaker.jpg';
const EXAMPLE_IMAGE_URL_PNG =
  'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Camera.png';
const EXAMPLE_IMAGE_URL_PIC_SUM =
  'https://fastly.picsum.photos/id/1075/200/300.jpg?hmac=pffU5_mFDClpUhsTVng81yHXXvdsGGKHi1jCz2pRsaU';

@Injectable()
export class FcmService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    /* -------------------------------------------------------------------------- */
    /*                            firebase - admin sdk                            */
    /* -------------------------------------------------------------------------- */
    const env = process.env.NODE_ENV || 'dev';
    const keyFilePath =
      env === 'dev'
        ? process.env.DEVELOPMENT_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH
        : process.env.OPERATION_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH;

    if (!keyFilePath) {
      throw new Error('Service account key file path is not defined');
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });

    /* -------------------------------------------------------------------------- */
    /*                            firebase - messaging                            */
    /* -------------------------------------------------------------------------- */

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
          .setImage(messageDto.notification.imageUrl);
      } else if ('topic' in messageDto) {
        messageBuilder
          .setTopic(messageDto.topic)
          .setData(messageDto.data)
          .setNotification(messageDto.notification)
          .setUid(messageDto.uid)
          .setImage(messageDto.notification.imageUrl);
      } else if ('condition' in messageDto) {
        messageBuilder
          .setCondition(messageDto.condition)
          .setData(messageDto.data)
          .setNotification(messageDto.notification)
          .setUid(messageDto.uid)
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
}
