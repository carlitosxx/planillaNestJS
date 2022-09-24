import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketTempDto } from './create-ticket-temp.dto';

export class UpdateTicketTempDto extends PartialType(CreateTicketTempDto) {}