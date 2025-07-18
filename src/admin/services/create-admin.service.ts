import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from 'src/auth/dto/admin-login.dto';

@Injectable()
export class CreateAdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async execute(dto: AdminLoginDto): Promise<Partial<Admin>> {
    const exists = await this.adminRepo.findOneBy({ email: dto.email });
    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ email: dto.email, password: hashed });
    const savedAdmin = await this.adminRepo.save(admin);
    return { id: savedAdmin.id, email: savedAdmin.email };
  }
}
