import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorModule } from './donor/donor.module';
import { Donor } from './donor/entities/donor.entity';
import { AuthModule } from './auth/auth.module';
import { DonationModule } from './donation/donation.module';
import { Donation } from './donation/entities/donation.entity';
import { MailModule } from './mail/mail.module';
import { HospitalRequestModule } from './hospital-request/hospital-request.module';
import { HospitalRequest } from './hospital-request/entities/hospital-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [Donor, Donation, HospitalRequest],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    DonorModule,
    AuthModule,
    DonationModule,
    MailModule,
    HospitalRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
