import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganicUnitDto } from './create-organic-unit.dto';

export class UpdateOrganicUnitDto extends PartialType(CreateOrganicUnitDto) {}
