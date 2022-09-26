import { PartialType } from '@nestjs/mapped-types';
import { CreateCorrelativeDto } from './create-correlative.dto';

export class UpdateCorrelativeDto extends PartialType(CreateCorrelativeDto) {}