import { Module } from '@nestjs/common';
import { LoginService } from './services/login-donor.service';
import { AuthController } from './auth.controller';
import { GetAccessTokenService } from './services/get-access-token.service';
import { RegisterService } from './services/register-donor.service';

@Module({
  controllers: [AuthController],
  providers: [GetAccessTokenService, LoginService, RegisterService],
})
export class AuthModule {}
