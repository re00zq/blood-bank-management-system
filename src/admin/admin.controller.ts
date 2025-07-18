import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminService } from './services/create-admin.service';
import { AdminLoginDto } from 'src/auth/dto/admin-login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly createAdminService: CreateAdminService) {}

  @Post()
  create(@Body() createAdminDto: AdminLoginDto) {
    return this.createAdminService.execute(createAdminDto);
  }
}
