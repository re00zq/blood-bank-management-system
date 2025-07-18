import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './services/register-donor.service';
import { LoginService } from './services/login-donor.service';
import { DonorLoginDto } from './dto/donor-login.dto';
import { CreateDonorDto } from 'src/donor/dto/create-donor.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminLoginService } from './services/login-admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly adminLoginService: AdminLoginService,
  ) {}

  @Post('login')
  login(@Body() loginDto: DonorLoginDto) {
    return this.loginService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: CreateDonorDto) {
    return this.registerService.register(registerDto);
  }

  @Post('admin')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminLoginService.login(adminLoginDto);
  }
}
