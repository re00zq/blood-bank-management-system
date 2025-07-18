import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAdminService } from './services/create-admin.service';
import { AdminLoginDto } from 'src/auth/dto/admin-login.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly createAdminService: CreateAdminService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createAdminDto: AdminLoginDto) {
    return this.createAdminService.execute(createAdminDto);
  }
}
