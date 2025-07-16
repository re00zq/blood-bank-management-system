import { Test, TestingModule } from '@nestjs/testing';
import { BloodStockController } from './blood-stock.controller';
import { BloodStockService } from './blood-stock.service';

describe('BloodStockController', () => {
  let controller: BloodStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodStockController],
      providers: [BloodStockService],
    }).compile();

    controller = module.get<BloodStockController>(BloodStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
