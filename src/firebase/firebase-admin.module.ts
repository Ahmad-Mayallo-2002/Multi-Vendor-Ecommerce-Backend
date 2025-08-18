import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from './entity/user-device.entity';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_MESSAGING',
      inject: [ConfigService],
      useFactory: () => {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n',
        );

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

        return admin.messaging();
      },
    },
    NotificationResolver,
    NotificationService,
    DeviceService,
  ],
  imports: [TypeOrmModule.forFeature([UserDevice])],
  exports: ['FIREBASE_MESSAGING'],
})
export class FirebaseAdminModule {}
