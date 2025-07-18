import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminService } from './create-admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from 'src/auth/dto/admin-login.dto';

describe('CreateAdminService', () => {
  let service: CreateAdminService;
  let repo: Repository<Admin>;

  const mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CreateAdminService>(CreateAdminService);
    repo = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => jest.clearAllMocks());

  const dto: AdminLoginDto = {
    email: 'admin@example.com',
    password: 'secure123',
  };

  it('should create and return new admin if email not exists', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    const mockHashedPassword = await bcrypt.hash(dto.password, 10);
    const mockAdmin = { id: 1, email: dto.email, password: mockHashedPassword };
    mockRepo.create.mockReturnValue(mockAdmin);
    mockRepo.save.mockResolvedValue(mockAdmin);

    const result = await service.execute(dto);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: dto.email });
    expect(mockRepo.create).toHaveBeenCalledWith({
      email: dto.email,
      password: expect.any(String),
    });
    expect(mockRepo.save).toHaveBeenCalledWith(mockAdmin);
    expect(result).toEqual({ id: mockAdmin.id, email: mockAdmin.email });
  });

  it('should throw ConflictException if email already exists', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, email: dto.email });

    await expect(service.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: dto.email });
    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
