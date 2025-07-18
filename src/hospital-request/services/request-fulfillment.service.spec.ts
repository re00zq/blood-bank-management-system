import { Test, TestingModule } from '@nestjs/testing';
import { RequestFulfillmentService } from './request-fulfillment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HospitalRequest } from '../entities/hospital-request.entity';
import { Donation } from 'src/donation/entities/donation.entity';
import { Repository } from 'typeorm';
import { MoreThanOrEqual } from 'typeorm';

describe('RequestFulfillmentService', () => {
  let service: RequestFulfillmentService;
  let hospitalRepo: jest.Mocked<Repository<HospitalRequest>>;
  let donationRepo: jest.Mocked<Repository<Donation>>;

  const mockHospitalRequests: HospitalRequest[] = Array.from(
    { length: 10 },
    (_, i) =>
      ({
        id: i + 1,
        bloodType: 'A+',
        city: 'Cairo',
        hospitalName: `Hospital ${i + 1}`,
        patientStatus: i < 3 ? 'Immediate' : i < 6 ? 'Urgent' : 'Normal',
        quantity: 1,
        isFulfilled: false,
        requestedAt: new Date(Date.now() - i * 1000 * 60),
      }) as HospitalRequest,
  );

  const mockDonations: Donation[] = Array.from(
    { length: 10 },
    (_, i) =>
      ({
        id: i + 1,
        bloodType: 'A+',
        virusTestNegative: true,
        isUsed: false,
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bloodBankCity: i < 5 ? 'Cairo' : 'Alexandria',
      }) as Donation,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestFulfillmentService,
        {
          provide: getRepositoryToken(HospitalRequest),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Donation),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestFulfillmentService>(RequestFulfillmentService);
    hospitalRepo = module.get(getRepositoryToken(HospitalRequest));
    donationRepo = module.get(getRepositoryToken(Donation));
  });

  afterEach(() => jest.clearAllMocks());

  it('should not fulfill if less than 10 unfulfilled requests exist', async () => {
    (hospitalRepo.find as jest.Mock).mockResolvedValue(
      mockHospitalRequests.slice(0, 5),
    );

    const result = await service.fulfillPendingRequests();

    expect(result).toEqual({
      message: 'Not enough hospital requests to process. Minimum is 10.',
      fulfilledRequests: 0,
      totalRequests: 5,
    });
  });

  it('should fulfill requests by urgency and city proximity', async () => {
    (hospitalRepo.find as jest.Mock).mockResolvedValue(mockHospitalRequests);
    (donationRepo.find as jest.Mock).mockResolvedValue(mockDonations);
    (donationRepo.save as jest.Mock).mockImplementation((d) =>
      Promise.resolve(d),
    );
    (hospitalRepo.save as jest.Mock).mockImplementation((r) =>
      Promise.resolve(r),
    );

    const result = await service.fulfillPendingRequests();

    expect(result.message).toBe('Batch fulfillment completed.');
    expect(result.fulfilledRequests).toBe(10);
    expect(result.totalRequests).toBe(10);

    expect(hospitalRepo.save).toHaveBeenCalledTimes(10);
    expect(donationRepo.save).toHaveBeenCalled();
  });
});
