import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import { JwtPayload } from 'src/auth/types/JwtPayload';

@Injectable()
export class ListDonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
  ) {}

  async findAll(user: JwtPayload): Promise<Donation[]> {
    let donations: Donation[] = [];
    // if the user is an admin, return all donations
    if (user.role === 'admin') donations = await this.donationRepo.find();

    // if the user is a donor, return only their donations
    if (user.role === 'donor')
      donations = await this.donationRepo.find({
        where: { donor: { id: user.sub } },
      });

    if (!donations || donations.length === 0)
      throw new NotFoundException('No donations found');
    return donations;
  }
}
