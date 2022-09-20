import { PartialType } from '@nestjs/mapped-types';
import { CreateOccupationalGroupDto } from './create-occupational-group.dto';

export class UpdateOccupationalGroupDto extends PartialType(CreateOccupationalGroupDto) {}