import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
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
  }
}
