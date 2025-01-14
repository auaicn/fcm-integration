import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';

@Injectable()
export class FcmService {
  private messaging: admin.messaging.Messaging;

  constructor() {
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

  async sendMessage({
    token,
    notification_title = 'notification_title',
    notification_content = 'notification_content',
    data,
  }: {
    token: string;
    notification_title?: string;
    notification_content?: string;
    data: {
      [key: string]: string;
    };
  }): Promise<any> {
    const defaultMessage: Omit<
      admin.messaging.Message,
      'condition' | 'topic' | 'token'
    > = {
      android: {
        priority: 'high',
        ttl: 0,
        restrictedPackageName:
          process.env.NODE_ENV === 'dev'
            ? 'com.vetfching.plusvetm.development'
            : 'com.vetfching.plusvetm',
        directBootOk: true,
        notification: {
          tag: 'message-id',
          clickAction: 'chatroom-open',
          channelId: 'chat',
          eventTimestamp: new Date(),
        },
      },
      apns: {},
    };

    const message: admin.messaging.Message = _.merge(defaultMessage, {
      token,
      data,
      notification: {
        title: notification_title,
        body: notification_content,
        imageUrl:
          'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Speaker.jpg',
      },
    });

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
