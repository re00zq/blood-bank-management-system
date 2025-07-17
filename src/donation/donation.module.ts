import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { CreateDonationService } from './services/create-donation.service';
import { DonorModule } from 'src/donor/donor.module';
import { Donation } from './entities/donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), DonorModule],
  controllers: [DonationController],
  providers: [CreateDonationService],
})
export class DonationModule {}
