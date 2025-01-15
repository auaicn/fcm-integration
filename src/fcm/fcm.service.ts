/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import { MessageBuilder } from './message.builder';

@Injectable()
export class FcmService {
  private messaging: admin.messaging.Messaging;

  constructor(private readonly messageBuilder: MessageBuilder) {
    const env = process.env.NODE_ENV || 'dev';
    const keyFilePath =
      env === 'dev'
        ? process.env.DEVELOPMENT_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH
        : process.env.OPERATION_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH;

    if (!keyFilePath) {
      throw new Error('Service account key file path is not defined');
    }

    // Set GOOGLE_APPLICATION_CREDENTIALS
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });

    this.messaging = admin.messaging(); // Use the initialized Firebase app
  }

  sendTestNotification() {
    return { success: true, message: 'Test notification sent!' };
  }

  EXAMPLE_IMAGE_URL_JPG =
    'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Speaker.jpg';
  EXAMPLE_IMAGE_URL_PNG =
    'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Camera.png';
  EXAMPLE_IMAGE_URL_PIC_SUM =
    'https://fastly.picsum.photos/id/1075/200/300.jpg?hmac=pffU5_mFDClpUhsTVng81yHXXvdsGGKHi1jCz2pRsaU';

  async sendMessage({
    token,
    uid,
    notification,
    data,
  }: {
    token: string;
    uid: string;
    notification?: {
      title?: string;
      body?: string;
      imageUrl?: string;
    };
    data?: {
      [key: string]: string;
    };
  }): Promise<any> {
    const builder = this.messageBuilder
      .setToken(token)
      .setData(data)
      .setNotification(notification)
      .setAndroidOptions(uid)
      .setApnsOptions(uid, notification?.imageUrl);

    const message = builder.build();

    try {
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
