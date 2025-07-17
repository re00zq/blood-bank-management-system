import { Module } from '@nestjs/common';
import { LoginService } from './services/login-donor.service';
import { AuthController } from './auth.controller';
import { GetAccessTokenService } from './services/get-access-token.service';
import { RegisterService } from './services/register-donor.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DonorModule } from 'src/donor/donor.module';
import { AccessTokenStrategy } from './access-token.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    GetAccessTokenService,
    LoginService,
    RegisterService,
    AccessTokenStrategy,
  ],
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DonorModule,
  ],
})
export class AuthModule {}
