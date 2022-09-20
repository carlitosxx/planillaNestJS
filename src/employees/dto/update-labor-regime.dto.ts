import { PartialType } from '@nestjs/mapped-types';
import { CreateLaborRegimeDto } from './create-labor-regime.dto';

export class UpdateLaborRegimeDto extends PartialType(CreateLaborRegimeDto) {}
