import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from '../entities/donor.entity';
import { CreateDonorDto } from '../dto/create-donor.dto';

@Injectable()
export class CreateDonorService {
  constructor(
    @InjectRepository(Donor) private readonly donorRepo: Repository<Donor>,
  ) {}

  create(donor: CreateDonorDto): Promise<Donor> {
    const newDonor: Donor = this.donorRepo.create(donor);
    return this.donorRepo.save(newDonor);
  }
}
