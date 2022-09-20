import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeCategoryDto } from './create-employee-category.dto';

export class UpdateEmployeeCategoryDto extends PartialType(CreateEmployeeCategoryDto) {}
