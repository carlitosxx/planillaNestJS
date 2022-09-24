import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeConceptDto } from './create-type-concept.dto';

export class UpdateTypeConceptDto extends PartialType(CreateTypeConceptDto) {}