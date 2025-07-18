import { Module } from '@nestjs/common';
import { HospitalRequestController } from './hospital-request.controller';
import { CreateHospitalRequestService } from './services/create-hospital-request.service';
import { HospitalRequest } from './entities/hospital-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestFulfillmentService } from './services/request-fulfillment.service';
import { Donation } from 'src/donation/entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HospitalRequest]),
    TypeOrmModule.forFeature([Donation]),
  ],
  controllers: [HospitalRequestController],
  providers: [CreateHospitalRequestService, RequestFulfillmentService],
})
export class HospitalRequestModule {}
