import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeEmployeeDto } from './create-type-employee.dto';

export class UpdateTypeEmployeeDto extends PartialType(CreateTypeEmployeeDto) {}
