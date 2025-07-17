import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreateDonationService } from './services/create-donation.service';
import { AccessTokenGuard } from 'src/auth/access-token.guard';

@Controller('donations')
export class DonationController {
  constructor(private readonly createDonationService: CreateDonationService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async donate(@Request() req, @Body() createDonationDto: CreateDonationDto) {
    const donor = req.user;
    return this.createDonationService.createDonation(donor, createDonationDto);
  }
}
