import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalRequest } from '../entities/hospital-request.entity';
import { CreateHospitalRequestDto } from '../dto/create-hospital-request.dto';
import { RequestFulfillmentService } from './request-fulfillment.service';

@Injectable()
export class CreateHospitalRequestService {
  constructor(
    @InjectRepository(HospitalRequest)
    private readonly requestRepo: Repository<HospitalRequest>,
    private readonly requestFulfillmentService: RequestFulfillmentService,
  ) {}

  async create(hospitalRequest: CreateHospitalRequestDto): Promise<{
    message: string;
    fulfilledRequests?: number;
    totalRequests?: number;
    totalPendingRequests?: number;
    hospitalRequest: HospitalRequest;
  }> {
    const newRequest: HospitalRequest =
      this.requestRepo.create(hospitalRequest);

    // save the request to the database
    const savedRequest = await this.requestRepo.save(newRequest);

    // Check if there are at least 10 unfulfilled requests
    const unfulfilledRequests = await this.requestRepo.count({
      where: { isFulfilled: false },
    });
    if (unfulfilledRequests >= 10) {
      const result =
        await this.requestFulfillmentService.fulfillPendingRequests();

      // If batch fulfillment is successful, return the result
      return {
        ...result,
        hospitalRequest: savedRequest,
      };
    } else {
      return {
        message: `Request saved. Waiting for at least 10 total requests before processing.`,
        totalPendingRequests: unfulfilledRequests,
        hospitalRequest: savedRequest,
      };
    }
  }
}
