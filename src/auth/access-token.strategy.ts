import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/JwtPayload';
import { Donor } from 'src/donor/entities/donor.entity';
import { FindDonorService } from 'src/donor/services/find-donor.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly findDonor: FindDonorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload): Promise<Donor> {
    const donor: Donor | null = await this.findDonor.findOne({
      id: payload.sub,
    });
    if (!donor) throw new Error('donor not found');
    return donor;
  }
}
