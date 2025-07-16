import { Module } from '@nestjs/common';
import { BloodStockService } from './blood-stock.service';
import { BloodStockController } from './blood-stock.controller';

@Module({
  controllers: [BloodStockController],
  providers: [BloodStockService],
})
export class BloodStockModule {}
