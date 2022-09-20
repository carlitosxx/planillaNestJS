import { PartialType } from '@nestjs/mapped-types';
import { CreatePensionSystemDto } from './create-pension-system.dto';

export class UpdatePensionSystemDto extends PartialType(CreatePensionSystemDto) {}
