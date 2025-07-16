import { Injectable } from '@nestjs/common';
import { CreateBloodStockDto } from './dto/create-blood-stock.dto';
import { UpdateBloodStockDto } from './dto/update-blood-stock.dto';

@Injectable()
export class BloodStockService {
  create(createBloodStockDto: CreateBloodStockDto) {
    return 'This action adds a new bloodStock';
  }

  findAll() {
    return `This action returns all bloodStock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bloodStock`;
  }

  update(id: number, updateBloodStockDto: UpdateBloodStockDto) {
    return `This action updates a #${id} bloodStock`;
  }

  remove(id: number) {
    return `This action removes a #${id} bloodStock`;
  }
}
