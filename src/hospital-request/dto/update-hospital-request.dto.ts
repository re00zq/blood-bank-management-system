import { PartialType } from '@nestjs/swagger';
import { CreateHospitalRequestDto } from './create-hospital-request.dto';

export class UpdateHospitalRequestDto extends PartialType(CreateHospitalRequestDto) {}
