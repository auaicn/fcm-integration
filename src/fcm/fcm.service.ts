/* eslint-disable @typescript-eslint/no-unused-vars */
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

  EXAMPLE_IMAGE_URL_JPG =
    'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Speaker.jpg';
  EXAMPLE_IMAGE_URL_PNG =
    'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Camera.png';
  EXAMPLE_IMAGE_URL_PIC_SUM =
    'https://fastly.picsum.photos/id/1075/200/300.jpg?hmac=pffU5_mFDClpUhsTVng81yHXXvdsGGKHi1jCz2pRsaU';

  async sendMessage({
    token,
    serverMessageId,
    notification_title = 'notification_title',
    notification_content = 'notification_content',
    notification_imageUrl = this.EXAMPLE_IMAGE_URL_PIC_SUM,
    data,
  }: {
    token: string;
    serverMessageId: string;
    notification_title?: string;
    notification_content?: string;
    notification_imageUrl?: string;
    data: {
      [key: string]: string;
    };
  }): Promise<any> {
    const _common: Partial<admin.messaging.Message> = {
      android: {
        priority: 'high',
        ttl: 0,
        restrictedPackageName:
          process.env.NODE_ENV === 'dev'
            ? 'com.vetching.plusvetm.development'
            : 'com.vetching.plusvetm',
        directBootOk: true,
        notification: {
          clickAction: 'chatroom-open',
          channelId: 'chat',
          eventTimestamp: new Date(),
        },
      },
      apns: {
        headers: {
          'apns-priroty': '10',
          'mutable-content': '1',
        },
      },
    };

    const _img: Partial<admin.messaging.Message> | undefined =
      !notification_imageUrl
        ? undefined
        : {
            android: {
              notification: {
                imageUrl: notification_imageUrl,
              },
            },
            apns: {
              payload: {
                aps: {},
              },
              fcmOptions: {
                imageUrl: notification_imageUrl,
              },
            },
          };

    const _tag: Partial<admin.messaging.Message> | undefined = !serverMessageId
      ? undefined
      : {
          android: {
            notification: {
              tag: serverMessageId,
            },
          },
          apns: {
            headers: {
              'apns-collapse-id': serverMessageId,
            },
            payload: {
              aps: {},
            },
          },
        };

    const _mutable: admin.messaging.Message = {
      token,
      data,
      notification: {
        title: notification_title,
        body: notification_content,
      },
    };

    const message = _.merge(
      //
      _common,
      _img,
      _tag,
      _mutable,
    );

    console.log(message);

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
