import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDonorDto } from 'src/donor/dto/create-donor.dto';
import { Donor } from 'src/donor/entities/donor.entity';
import { CreateDonorService } from 'src/donor/services/create-donor.service';
import { FindDonorService } from 'src/donor/services/find-donor.service';
import { GetAccessTokenService } from './get-access-token.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly findDonor: FindDonorService,
    private readonly createDonor: CreateDonorService,
    private readonly getAccessTokenService: GetAccessTokenService,
  ) {}

  async register(
    donor: CreateDonorDto,
  ): Promise<{ accessToken: string; donor: Donor }> {
    //handle duplicate national id and email
    const nationalIdExists: Donor | null = await this.findDonor.findOne({
      nationalId: donor.nationalId,
    });
    if (nationalIdExists)
      throw new BadRequestException(
        'there is a donor with this national id please use another valid national id or login',
      );

    const emailExists: Donor | null = await this.findDonor.findOne({
      email: donor.email.toLocaleLowerCase(),
    });
    if (emailExists)
      throw new BadRequestException(
        'there is a donor with this email please use another valid email',
      );

    //saving donor data in DB
    donor.email = donor.email.toLocaleLowerCase();
    const newDonor: Donor = await this.createDonor.create(donor);

    const accessToken = await this.getAccessTokenService.get(
      newDonor.id,
      newDonor.email,
      'donor',
    );

    return { accessToken, donor: newDonor };
  }
}
