import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancingDto } from './create-financing.dto';

export class UpdateFinancingDto extends PartialType(CreateFinancingDto) {}
