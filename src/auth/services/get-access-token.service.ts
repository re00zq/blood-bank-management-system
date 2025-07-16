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

  async get(donorNationalId: string, donorEmail: string): Promise<string> {
    // Creating payload by user data
    const payload: JwtPayload = { sub: donorNationalId, email: donorEmail };

    // get access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return accessToken;
  }
}
