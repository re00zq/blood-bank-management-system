// donation.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import { Donor } from '../../donor/entities/donor.entity';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { UpdateDonorService } from 'src/donor/services/update-donor.service';

@Injectable()
export class CreateDonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,

    private readonly updateDonorService: UpdateDonorService,
  ) {}

  async createDonation(donor: Donor, dto: CreateDonationDto) {
    // 1. Reject if virus test is positive
    if (!dto.virusTestNegative) {
      throw new BadRequestException(
        'Donation rejected: virus test is positive.',
      );
    }

    // 2. Reject if last donation was less than 3 months ago
    if (donor.lastDonationDate) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (new Date(donor.lastDonationDate) > threeMonthsAgo) {
        throw new BadRequestException(
          'Donation rejected: must wait at least 3 months since last donation.',
        );
      }
    }

    // 3. Create and save donation
    const donation = this.donationRepo.create({
      donor,
      donorId: donor.id,
      bloodType: donor.bloodType,
      bloodBankCity: dto.bloodBankCity,
      virusTestNegative: dto.virusTestNegative,
      expirationDate: new Date(dto.expirationDate),
      isUsed: false,
    });

    await this.donationRepo.save(donation);

    // 4. Update donor's last donation date
    donor.lastDonationDate = donation.donationDate;
    await this.updateDonorService.update(donor.id, donor);

    return {
      message: 'Donation accepted and recorded successfully.',
      donation,
    };
  }
}
