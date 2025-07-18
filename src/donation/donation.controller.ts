import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreateDonationService } from './services/create-donation.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ListDonationsService } from './services/list-donations.service';

@Controller('donations')
export class DonationController {
  constructor(
    private readonly createDonationService: CreateDonationService,
    private readonly listDonationsService: ListDonationsService,
  ) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('donor')
  @Post()
  async donate(@Request() req, @Body() createDonationDto: CreateDonationDto) {
    const donor = req.user;
    return await this.createDonationService.createDonation(
      donor,
      createDonationDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async listDonations(@Request() req) {
    const user = req.user;
    return await this.listDonationsService.findAll(user);
  }
}
