import { Test, TestingModule } from '@nestjs/testing';
import { CreateDonationService } from 'src/donation/services/create-donation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Donation } from '../entities/donation.entity';
import { UpdateDonorService } from 'src/donor/services/update-donor.service';
import { SendDonorRejectionService } from 'src/mail/services/send-donor-rejection.service';
import { FindDonorService } from 'src/donor/services/find-donor.service';
import { BadRequestException } from '@nestjs/common';
import { Donor } from 'src/donor/entities/donor.entity';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { JwtPayload } from 'src/auth/types/JwtPayload';

describe('CreateDonationService', () => {
  let service: CreateDonationService;
  let donationRepo: Repository<Donation>;

  const mockDonationRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSendDonorRejectionService = {
    execute: jest.fn(),
  };

  const mockFindDonorService = {
    findOne: jest.fn(),
  };

  const mockUpdateDonorService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDonationService,
        {
          provide: getRepositoryToken(Donation),
          useValue: mockDonationRepo,
        },
        {
          provide: SendDonorRejectionService,
          useValue: mockSendDonorRejectionService,
        },
        { provide: FindDonorService, useValue: mockFindDonorService },
        { provide: UpdateDonorService, useValue: mockUpdateDonorService },
      ],
    }).compile();

    service = module.get<CreateDonationService>(CreateDonationService);
    donationRepo = module.get<Repository<Donation>>(
      getRepositoryToken(Donation),
    );
  });

  afterEach(() => jest.clearAllMocks());

  const donor: Donor = {
    id: 1,
    email: 'donor@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    bloodType: 'A+',
    city: 'Cairo',
    lastDonationDate: new Date(0),
    nationalId: '29801010101010',
    phoneNumber: '+201234567890',
  } as Donor;

  const payload: JwtPayload = {
    sub: donor.id,
    email: donor.email,
    role: 'donor',
  };

  const dto: CreateDonationDto = {
    bloodBankCity: 'Cairo',
    expirationDate: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30,
    ).toISOString(),
    virusTestNegative: true,
  };

  it('should create and save donation successfully', async () => {
    mockFindDonorService.findOne.mockResolvedValue(donor);
    const mockDonation = { id: 1, donor, donationDate: new Date(), ...dto };
    mockDonationRepo.create.mockReturnValue(mockDonation);
    mockDonationRepo.save.mockResolvedValue(mockDonation);

    const result = await service.createDonation(payload, dto);

    expect(mockFindDonorService.findOne).toHaveBeenCalledWith({ id: donor.id });
    expect(mockDonationRepo.create).toHaveBeenCalledWith({
      donor,
      donorId: donor.id,
      bloodType: donor.bloodType,
      bloodBankCity: dto.bloodBankCity,
      virusTestNegative: dto.virusTestNegative,
      expirationDate: new Date(dto.expirationDate),
      isUsed: false,
    });
    expect(mockDonationRepo.save).toHaveBeenCalledWith(mockDonation);
    expect(mockUpdateDonorService.update).toHaveBeenCalledWith(
      donor.id,
      expect.any(Object),
    );
    expect(result.message).toBe('Donation accepted and recorded successfully.');
  });

  it('should reject if virus test is positive', async () => {
    mockFindDonorService.findOne.mockResolvedValue(donor);
    const badDto = { ...dto, virusTestNegative: false };

    await expect(service.createDonation(payload, badDto)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockSendDonorRejectionService.execute).toHaveBeenCalledWith({
      donorEmail: donor.email,
      donorName: 'Jane Doe',
      reason: 'test',
    });
  });

  it('should reject if last donation was less than 3 months ago', async () => {
    const recentDonor = {
      ...donor,
      lastDonationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
    };
    mockFindDonorService.findOne.mockResolvedValue(recentDonor);

    await expect(service.createDonation(payload, dto)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockSendDonorRejectionService.execute).toHaveBeenCalledWith({
      donorEmail: recentDonor.email,
      donorName: 'Jane Doe',
      reason: 'interval',
    });
  });

  it('should throw if donor not found', async () => {
    mockFindDonorService.findOne.mockResolvedValue(null);

    await expect(service.createDonation(payload, dto)).rejects.toThrow(
      new BadRequestException('Donor not found'),
    );
  });
});
