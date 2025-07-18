import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { CreateDonationService } from './services/create-donation.service';
import { DonorModule } from 'src/donor/donor.module';
import { Donation } from './entities/donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ListDonationsService } from './services/list-donations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), DonorModule, MailModule],
  controllers: [DonationController],
  providers: [CreateDonationService, ListDonationsService],
})
export class DonationModule {}
