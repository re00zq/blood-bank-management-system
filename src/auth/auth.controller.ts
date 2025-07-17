import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './services/register-donor.service';
import { LoginService } from './services/login-donor.service';
import { DonorLoginDto } from './dto/donor-login';
import { CreateDonorDto } from 'src/donor/dto/create-donor.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @Post('login')
  login(@Body() loginDto: DonorLoginDto) {
    return this.loginService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: CreateDonorDto) {
    return this.registerService.register(registerDto);
  }
}
