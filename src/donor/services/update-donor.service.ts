import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from '../entities/donor.entity';
import { UpdateDonorDto } from '../dto/update-donor.dto';

@Injectable()
export class UpdateDonorService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {}

  async update(id: number, updateDonorDto: UpdateDonorDto): Promise<Donor> {
    const donor = await this.donorRepository.findOne({ where: { id } });
    if (!donor) {
      throw new NotFoundException(`Donor with id ${id} not found`);
    }
    Object.assign(donor, updateDonorDto);
    return this.donorRepository.save(donor);
  }
}
