import { PartialType } from '@nestjs/swagger';
import { CreateBloodStockDto } from './create-blood-stock.dto';

export class UpdateBloodStockDto extends PartialType(CreateBloodStockDto) {}
