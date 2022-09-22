import { PartialType } from '@nestjs/mapped-types';
import { CreatePensionAdministratorDto } from './create-pensionAdministrator.dto';

export class UpdatePensionAdministratorDto extends PartialType(CreatePensionAdministratorDto) {}