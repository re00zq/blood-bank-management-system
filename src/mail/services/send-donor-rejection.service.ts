import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendDonorRejectionService {
  constructor(private readonly mailerService: MailerService) {}

  async execute(options: {
    donorEmail: string;
    donorName: string;
    reason: 'interval' | 'test' | null;
  }): Promise<void> {
    const { donorEmail, donorName, reason } = options;

    await this.mailerService.sendMail({
      to: donorEmail,
      subject: 'Blood Donation Update',
      template: 'donor-rejection',
      context: {
        donorName,
        reason,
        senderName: 'Blood Bank Team',
      },
    });
  }
}
