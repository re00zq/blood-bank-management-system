import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import { Donor } from '../../donor/entities/donor.entity';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { UpdateDonorService } from 'src/donor/services/update-donor.service';
import { SendDonorRejectionService } from 'src/mail/services/send-donor-rejection.service';

@Injectable()
export class CreateDonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
    private readonly sendDonorRejectionService: SendDonorRejectionService,
    private readonly updateDonorService: UpdateDonorService,
  ) {}

  async createDonation(donor: Donor, dto: CreateDonationDto) {
    if (!donor) {
      throw new BadRequestException('Donor not found');
    }

    let rejectionReason: 'interval' | 'test' | null = null;

    // 1. Reject if virus test is positive
    if (!dto.virusTestNegative) rejectionReason = 'test';

    // 2. Reject if last donation was less than 3 months ago
    if (donor.lastDonationDate) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (new Date(donor.lastDonationDate) > threeMonthsAgo) {
        rejectionReason = 'interval';
      }
    }

    // If rejection reason is set, send email and throw exception
    if (rejectionReason) {
      await this.sendDonorRejectionService.execute({
        donorEmail: donor.email,
        donorName: donor.firstName + ' ' + donor.lastName,
        reason: rejectionReason,
      });
      throw new BadRequestException(
        `Donation rejected: ${rejectionReason === 'interval' ? 'Last donation was less than 3 months ago' : 'Virus test is positive'}`,
      );
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
