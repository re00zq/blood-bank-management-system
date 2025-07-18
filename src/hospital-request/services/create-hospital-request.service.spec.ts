import { Test, TestingModule } from '@nestjs/testing';
import { CreateHospitalRequestService } from './create-hospital-request.service';
import { RequestFulfillmentService } from './request-fulfillment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HospitalRequest } from '../entities/hospital-request.entity';
import { Repository } from 'typeorm';
import {
  CreateHospitalRequestDto,
  PatientStatus,
} from '../dto/create-hospital-request.dto';

describe('CreateHospitalRequestService', () => {
  let service: CreateHospitalRequestService;
  let repo: Repository<HospitalRequest>;
  let fulfillmentService: RequestFulfillmentService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  const mockFulfillmentService = {
    fulfillPendingRequests: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateHospitalRequestService,
        {
          provide: getRepositoryToken(HospitalRequest),
          useValue: mockRepo,
        },
        {
          provide: RequestFulfillmentService,
          useValue: mockFulfillmentService,
        },
      ],
    }).compile();

    service = module.get<CreateHospitalRequestService>(
      CreateHospitalRequestService,
    );
    repo = module.get<Repository<HospitalRequest>>(
      getRepositoryToken(HospitalRequest),
    );
    fulfillmentService = module.get<RequestFulfillmentService>(
      RequestFulfillmentService,
    );
  });

  afterEach(() => jest.clearAllMocks());

  const dto: CreateHospitalRequestDto = {
    hospitalName: 'General Hospital',
    city: 'Cairo',
    bloodType: 'A+',
    quantity: 3,
    patientStatus: PatientStatus.Normal,
  };

  const mockSavedRequest: HospitalRequest = {
    id: 1,
    requestedAt: new Date(),
    isFulfilled: false,
    ...dto,
  };

  it('should save request and trigger fulfillment if unfulfilled requests >= 10', async () => {
    mockRepo.create.mockReturnValue(mockSavedRequest);
    mockRepo.save.mockResolvedValue(mockSavedRequest);
    mockRepo.count.mockResolvedValue(10);

    const fulfillmentResult = {
      message: '10 requests fulfilled',
      fulfilledRequests: 10,
      totalRequests: 15,
    };
    mockFulfillmentService.fulfillPendingRequests.mockResolvedValue(
      fulfillmentResult,
    );

    const result = await service.create(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(mockSavedRequest);
    expect(mockRepo.count).toHaveBeenCalledWith({
      where: { isFulfilled: false },
    });
    expect(mockFulfillmentService.fulfillPendingRequests).toHaveBeenCalled();

    expect(result).toEqual({
      ...fulfillmentResult,
      hospitalRequest: mockSavedRequest,
    });
  });

  it('should save request and NOT trigger fulfillment if unfulfilled requests < 10', async () => {
    mockRepo.create.mockReturnValue(mockSavedRequest);
    mockRepo.save.mockResolvedValue(mockSavedRequest);
    mockRepo.count.mockResolvedValue(5);

    const result = await service.create(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(mockSavedRequest);
    expect(mockRepo.count).toHaveBeenCalledWith({
      where: { isFulfilled: false },
    });
    expect(
      mockFulfillmentService.fulfillPendingRequests,
    ).not.toHaveBeenCalled();

    expect(result).toEqual({
      message:
        'Request saved. Waiting for at least 10 total requests before processing.',
      totalPendingRequests: 5,
      hospitalRequest: mockSavedRequest,
    });
  });
});
