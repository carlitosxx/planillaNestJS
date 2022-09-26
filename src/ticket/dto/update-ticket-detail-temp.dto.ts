import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDetailTempDto } from './create-ticket-detail-temp.dto';

export class UpdateTicketDetailTempDto extends PartialType(CreateTicketDetailTempDto) {}