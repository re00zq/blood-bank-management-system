import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CreateAdminService } from './services/create-admin.service';
import { ValidateAdminService } from './services/validate-admin.service';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindAdminService } from './services/find-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [CreateAdminService, ValidateAdminService, FindAdminService],
  exports: [ValidateAdminService, FindAdminService],
})
export class AdminModule {}
