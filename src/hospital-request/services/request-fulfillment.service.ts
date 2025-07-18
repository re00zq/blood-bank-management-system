import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { HospitalRequest } from '../entities/hospital-request.entity';
import { Donation } from 'src/donation/entities/donation.entity';

@Injectable()
export class RequestFulfillmentService {
  constructor(
    @InjectRepository(HospitalRequest)
    private readonly requestRepo: Repository<HospitalRequest>,

    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
  ) {}

  private getUrgencyRank(status: 'Immediate' | 'Urgent' | 'Normal'): number {
    let rank: number;
    if (status === 'Immediate') {
      rank = 3;
    } else if (status === 'Urgent') {
      rank = 2;
    } else {
      rank = 1;
    }
    return rank;
  }

  private getCityDistance(cityA: string, cityB: string): number {
    return cityA.trim().toLowerCase() === cityB.trim().toLowerCase() ? 0 : 1;
  }

  async fulfillPendingRequests(): Promise<{
    message: string;
    fulfilledRequests: number;
    totalRequests: number;
  }> {
    const requests = await this.requestRepo.find({
      where: { isFulfilled: false },
      order: { requestedAt: 'ASC' },
    });

    if (requests.length < 10) {
      return {
        message: 'Not enough hospital requests to process. Minimum is 10.',
        fulfilledRequests: 0,
        totalRequests: requests.length,
      };
    }

    // Sort by urgency
    requests.sort(
      (a, b) =>
        this.getUrgencyRank(b.patientStatus) -
        this.getUrgencyRank(a.patientStatus),
    );

    let fulfilledCount = 0;

    for (const request of requests) {
      const availableDonations = await this.donationRepo.find({
        where: {
          bloodType: request.bloodType,
          isUsed: false,
          virusTestNegative: true,
          expirationDate: MoreThanOrEqual(new Date()),
        },
      });

      availableDonations.sort(
        (a, b) =>
          this.getCityDistance(a.bloodBankCity, request.city) -
          this.getCityDistance(b.bloodBankCity, request.city),
      );

      const matched = availableDonations.slice(0, request.quantity);

      if (matched.length >= request.quantity) {
        for (const donation of matched) {
          donation.isUsed = true;
          await this.donationRepo.save(donation);
        }

        request.isFulfilled = true;
        await this.requestRepo.save(request);

        fulfilledCount++;
      }
    }

    return {
      message: 'Batch fulfillment completed.',
      fulfilledRequests: fulfilledCount,
      totalRequests: requests.length,
    };
  }
}
