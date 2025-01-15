import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MessageBuilder {
  private message: Partial<admin.messaging.Message> = {};

  constructor() {
    this.setCommonFields();
  }

  setToken(token: string): this {
    _.merge(this.message, { token });

    return this;
  }

  setTopic(topic: string): this {
    _.merge(this.message, { topic });

    return this;
  }

  setCondition(condition: string): this {
    _.merge(this.message, { condition });

    return this;
  }

  private setCommonFields(): this {
    const common = {
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
          'apns-priority': '10',
        },
      },
    };

    this.message = _.merge(this.message, common);

    return this;
  }

  setImage(imageUrl?: string): this {
    if (!imageUrl) return this;

    this.message = _.merge(this.message, {
      notification: { imageUrl },
      apns: {
        headers: {
          'mutable-content': '1',
        },
      },
    });

    return this;
  }

  setUid(uid?: string): this {
    if (!uid) return this;

    this.message = _.merge(this.message, {
      android: {
        notification: {
          tag: uid,
        },
      },
      apns: {
        headers: {
          'apns-collapse-id': uid,
        },
      },
    });

    return this;
  }

  setData(data?: { [key: string]: string }): this {
    if (!data) return this;

    this.message = _.merge(this.message, { data });

    return this;
  }

  setNotification(notification?: { title?: string; body?: string }): this {
    if (!notification) return this;

    this.message = _.merge(this.message, {
      notification: {
        title: notification.title,
        body: notification.body,
      },
    });

    return this;
  }

  build(): admin.messaging.Message {
    return this.message as admin.messaging.Message;
  }
}
