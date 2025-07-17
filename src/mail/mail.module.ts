import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SendDonorRejectionService } from './services/send-donor-rejection.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          secure: false,
          port: configService.get<string>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Blood Bank Team" <${configService.get<string>('SMTP_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, '../', '../', 'src', 'mail', 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SendDonorRejectionService],
  exports: [SendDonorRejectionService],
})
export class MailModule {}
