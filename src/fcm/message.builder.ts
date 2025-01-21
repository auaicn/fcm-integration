import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MessageBuilder {
  private message: Partial<admin.messaging.Message> = {};

  constructor() {
    this.init();
  }

  build(): admin.messaging.Message {
    return this.message as admin.messaging.Message;
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

  private init(): this {
    const fields$common: Partial<admin.messaging.Message> = {
      android: {
        priority: 'high',
        ttl: 0,
        restrictedPackageName:
          process.env.NODE_ENV === 'dev'
            ? 'com.vetching.plusvetm.development'
            : 'com.vetching.plusvetm',
        directBootOk: true,
        notification: {
          //   clickAction: 'chatroom-open', // 필요한지 조금 더 보긴 해야겠다.
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

    this.message = _.merge(this.message, fields$common);
    return this;
  }

  setImage(imageUrl?: string): this {
    if (!imageUrl) return this;

    const fields: Partial<admin.messaging.Message> = {
      notification: { imageUrl },
      apns: {
        headers: {
          'mutable-content': '1',
        },
      },
    };

    this.message = _.merge(this.message, fields);
    return this;
  }

  setUid(uid?: string): this {
    if (!uid) return this;

    const fields: Partial<admin.messaging.Message> = {
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
      data: {
        // client 에도 전달하기 위함
        uid: uid,
      },
    };

    this.message = _.merge(this.message, fields);
    return this;
  }

  setData(data?: { [key: string]: string }): this {
    if (!data) return this;

    const fields: Partial<admin.messaging.Message> = {
      data,
    };

    this.message = _.merge(this.message, fields);
    return this;
  }

  setNotification(notification?: { title?: string; body?: string }): this {
    if (!notification) return this;

    const fields: Partial<admin.messaging.Message> = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };

    this.message = _.merge(this.message, fields);
    return this;
  }

  setSound(sound?: string): this {
    if (!sound) return this;

    const fields: Partial<admin.messaging.Message> = {
      apns: {
        payload: {
          aps: {
            sound,
          },
        },
      },
      android: {
        notification: {
          sound,
        },
      },
    };

    this.message = _.merge(this.message, fields);
    return this;
  }
}
