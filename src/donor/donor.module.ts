import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';
import { Donor } from './entities/donor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorController],
  providers: [DonorService],
})
export class DonorModule {}
