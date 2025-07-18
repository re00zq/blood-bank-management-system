import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetAccessTokenService } from './get-access-token.service';
import { DonorLoginDto } from '../dto/donor-login.dto';
import { Donor } from 'src/donor/entities/donor.entity';
import { FindDonorService } from 'src/donor/services/find-donor.service';
@Injectable()
export class LoginService {
  constructor(
    private readonly getAccessTokenService: GetAccessTokenService,
    private readonly findDonorService: FindDonorService,
  ) {}
  async login(
    donorLoginDto: DonorLoginDto,
  ): Promise<{ accessToken: string; donor: Donor }> {
    const { nationalId } = donorLoginDto;

    // get the user from DB
    const donor: Donor | null = await this.findDonorService.findOne({
      nationalId,
    });

    // check if the email or password is't correct
    if (!donor)
      throw new UnauthorizedException(
        'there is no donor with this national id please register a new donor',
      );

    const accessToken = await this.getAccessTokenService.get(
      donor.id,
      donor.email,
      'donor',
    );

    // send jwt token
    return { accessToken, donor };
  }
}
