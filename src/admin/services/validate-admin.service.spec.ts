import { Test, TestingModule } from '@nestjs/testing';
import { ValidateAdminService } from './validate-admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('ValidateAdminService', () => {
  let service: ValidateAdminService;
  let repo: Repository<Admin>;

  const mockRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateAdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ValidateAdminService>(ValidateAdminService);
    repo = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => jest.clearAllMocks());

  const email = 'admin@example.com';
  const plainPassword = 'secure123';
  const hashedPassword = bcrypt.hashSync(plainPassword, 10);

  it('should return admin if email exists and password matches', async () => {
    const mockAdmin = { id: 1, email, password: hashedPassword } as Admin;
    mockRepo.findOneBy.mockResolvedValue(mockAdmin);

    const result = await service.execute(email, plainPassword);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email });
    expect(result).toEqual(mockAdmin);
  });

  it('should return null if email exists but password does not match', async () => {
    const mockAdmin = {
      id: 1,
      email,
      password: bcrypt.hashSync('wrongpass', 10),
    } as Admin;
    mockRepo.findOneBy.mockResolvedValue(mockAdmin);

    const result = await service.execute(email, plainPassword);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email });
    expect(result).toBeNull();
  });

  it('should return null if admin not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    const result = await service.execute(email, plainPassword);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email });
    expect(result).toBeNull();
  });
});
