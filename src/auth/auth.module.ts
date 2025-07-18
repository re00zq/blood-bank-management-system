import { Module } from '@nestjs/common';
import { LoginService } from './services/donor-login.service';
import { AuthController } from './auth.controller';
import { GetAccessTokenService } from './services/get-access-token.service';
import { RegisterService } from './services/donor-register.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DonorModule } from 'src/donor/donor.module';
import { AccessTokenStrategy } from './access-token.strategy';
import { AdminLoginService } from './services/admin-login.service';
import { AdminModule } from 'src/admin/admin.module';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
  controllers: [AuthController],
  providers: [
    GetAccessTokenService,
    LoginService,
    RegisterService,
    AccessTokenStrategy,
    AdminLoginService,
    AccessTokenGuard,
  ],
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DonorModule,
    AdminModule,
  ],
})
export class AuthModule {}
