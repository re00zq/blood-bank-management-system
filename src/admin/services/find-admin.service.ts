import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class FindAdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async findOne(query: object): Promise<Admin | null> {
    const admin: Admin | null = await this.adminRepo.findOneBy(query);
    return admin;
  }
}
