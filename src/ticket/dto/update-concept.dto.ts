import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptDto } from './create-concept.dto';

export class UpdateConceptDto extends PartialType(CreateConceptDto) {}