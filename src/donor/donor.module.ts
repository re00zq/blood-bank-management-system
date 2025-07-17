import { Module } from '@nestjs/common';
import { DonorController } from './donor.controller';
import { Donor } from './entities/donor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateDonorService } from './services/create-donor.service';
import { ListDonorService } from './services/list-donors.service';
import { FindDonorService } from './services/find-donor.service';
import { UpdateDonorService } from './services/update-donor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorController],
  providers: [
    CreateDonorService,
    ListDonorService,
    FindDonorService,
    UpdateDonorService,
  ],
  exports: [FindDonorService, CreateDonorService, UpdateDonorService],
})
export class DonorModule {}
