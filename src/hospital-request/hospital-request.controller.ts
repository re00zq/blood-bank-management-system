import { Controller, Post, Body } from '@nestjs/common';
import { CreateHospitalRequestDto } from './dto/create-hospital-request.dto';
import { CreateHospitalRequestService } from './services/create-hospital-request.service';

@Controller('hospital-request')
export class HospitalRequestController {
  constructor(
    private readonly createHospitalRequestService: CreateHospitalRequestService,
  ) {}

  @Post()
  async create(@Body() createHospitalRequestDto: CreateHospitalRequestDto) {
    return await this.createHospitalRequestService.create(
      createHospitalRequestDto,
    );
  }
}
