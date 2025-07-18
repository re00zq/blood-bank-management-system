// src/admin/services/admin-login.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetAccessTokenService } from './get-access-token.service';
import { ValidateAdminService } from '../../admin/services/validate-admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';

@Injectable()
export class AdminLoginService {
  constructor(
    private readonly validateAdmin: ValidateAdminService,
    private readonly getAccessTokenService: GetAccessTokenService,
  ) {}

  async login(adminLoginDto: AdminLoginDto) {
    const admin = await this.validateAdmin.execute(
      adminLoginDto.email,
      adminLoginDto.password,
    );
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.getAccessTokenService.get(
      admin.id,
      admin.email,
      'admin',
    );
    return { accessToken };
  }
}
