import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/JwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetAccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async get(
    id: number,
    email: string,
    role: 'admin' | 'donor',
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: id,
      email,
      role,
    };

    // Get JWT configuration
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    if (!secret) {
      throw new Error('JWT configuration error: JWT_SECRET is missing');
    }

    // get access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn || '1d',
    });

    return accessToken;
  }
}
