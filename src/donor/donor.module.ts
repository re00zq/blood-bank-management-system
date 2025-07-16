import { Module } from '@nestjs/common';
import { DonorController } from './donor.controller';
import { Donor } from './entities/donor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorController],
  providers: [],
})
export class DonorModule {}
