import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidateAdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async execute(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepo.findOneBy({ email });
    if (!admin) return null;

    const match = await bcrypt.compare(password, admin.password);
    return match ? admin : null;
  }
}
