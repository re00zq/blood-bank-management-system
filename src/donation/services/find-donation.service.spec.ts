import { Test, TestingModule } from '@nestjs/testing';
import { FindDonationService } from './find-donation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';

describe('FindDonationService', () => {
  let service: FindDonationService;
  let repo: Repository<Donation>;

  const mockDonationRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindDonationService,
        {
          provide: getRepositoryToken(Donation),
          useValue: mockDonationRepo,
        },
      ],
    }).compile();

    service = module.get<FindDonationService>(FindDonationService);
    repo = module.get<Repository<Donation>>(getRepositoryToken(Donation));
  });

  afterEach(() => jest.clearAllMocks());

  it('should return a donation if found', async () => {
    const donation = { id: 1, bloodType: 'A+', donorId: 2 } as Donation;
    mockDonationRepo.findOneBy.mockResolvedValue(donation);

    const result = await service.findOne({ id: 1 });

    expect(mockDonationRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(donation);
  });

  it('should return null if donation not found', async () => {
    mockDonationRepo.findOneBy.mockResolvedValue(null);

    const result = await service.findOne({ id: 999 });

    expect(mockDonationRepo.findOneBy).toHaveBeenCalledWith({ id: 999 });
    expect(result).toBeNull();
  });
});
