import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from '../entities/donor.entity';

@Injectable()
export class ListDonorService {
  constructor(
    @InjectRepository(Donor) private readonly donorRepo: Repository<Donor>,
  ) {}

  async findAll(): Promise<Donor[]> {
    const donors: Donor[] = await this.donorRepo.find();
    if (!donors || donors.length === 0)
      throw new NotFoundException('No donors found');
    return donors;
  }
}
