import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from '../entities/donor.entity';

@Injectable()
export class FindDonorService {
  constructor(
    @InjectRepository(Donor) private readonly donorRepo: Repository<Donor>,
  ) {}

  async findOne(query: object): Promise<Donor | null> {
    const donor: Donor | null = await this.donorRepo.findOneBy(query);
    return donor;
  }
}
