import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MessageBuilder {
  private message: Partial<admin.messaging.Message> = {};

  setToken(token: string): this {
    _.merge(this.message, { token });
    return this;
  }

  setData(data?: { [key: string]: string }): this {
    if (data) {
      _.merge(this.message, { data });
    }
    return this;
  }

  setNotification(notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  }): this {
    if (notification) {
      _.merge(this.message, {
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.imageUrl ? { imageUrl: notification.imageUrl } : {}),
        },
      });
    }
    return this;
  }

  setAndroidOptions(uid?: string): this {
    const androidOptions = {
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
          ...(uid ? { tag: uid } : {}),
        },
      },
    };

    _.merge(this.message, androidOptions);
    return this;
  }

  setApnsOptions(uid?: string, imageUrl?: string): this {
    const apnsOptions = {
      apns: {
        headers: {
          'apns-priority': '10',
          ...(uid ? { 'apns-collapse-id': uid } : {}),
          ...(imageUrl ? { 'mutable-content': '1' } : {}),
        },
        payload: {
          aps: {},
        },
      },
    };

    _.merge(this.message, apnsOptions);
    return this;
  }

  build(): admin.messaging.Message {
    return this.message as admin.messaging.Message;
  }
}
