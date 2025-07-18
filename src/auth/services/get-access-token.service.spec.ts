import { Test, TestingModule } from '@nestjs/testing';
import { GetAccessTokenService } from './get-access-token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('GetAccessTokenService', () => {
  let service: GetAccessTokenService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string): string | null | undefined => {
      if (key === 'JWT_SECRET') return 'test_secret';
      if (key === 'JWT_EXPIRES_IN') return '1h';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAccessTokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<GetAccessTokenService>(GetAccessTokenService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should generate access token with correct payload', async () => {
    const expectedToken = 'mocked.jwt.token';
    mockJwtService.signAsync.mockResolvedValue(expectedToken);

    const token = await service.get(1, 'user@example.com', 'admin');

    expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    expect(mockConfigService.get).toHaveBeenCalledWith('JWT_EXPIRES_IN');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(
      { sub: 1, email: 'user@example.com', role: 'admin' },
      { secret: 'test_secret', expiresIn: '1h' },
    );
    expect(token).toBe(expectedToken);
  });

  it('should throw an error if JWT_SECRET is missing', async () => {
    // Override get() to simulate missing JWT_SECRET
    mockConfigService.get.mockImplementation(
      (key: string): string | undefined => {
        if (key === 'JWT_SECRET') return undefined;
        if (key === 'JWT_EXPIRES_IN') return '1h';
        return undefined;
      },
    );

    await expect(service.get(1, 'user@example.com', 'admin')).rejects.toThrow(
      'JWT configuration error: JWT_SECRET is missing',
    );
  });
});
