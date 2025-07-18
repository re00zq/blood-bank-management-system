import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';

@Injectable()
export class FindDonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
  ) {}

  async findOne(query: object): Promise<Donation | null> {
    const donation: Donation | null = await this.donationRepo.findOneBy(query);
    return donation;
  }
}
