import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListDonorService } from './services/list-donors.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('donors')
export class DonorController {
  constructor(private readonly listDonorService: ListDonorService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @Get('')
  listDonors() {
    return this.listDonorService.findAll();
  }
}
