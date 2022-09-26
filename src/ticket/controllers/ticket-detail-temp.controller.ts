import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { TicketDetailTempService } from '../services/ticket-detail-temp.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTicketDetailTempDto } from '../dto/create-ticket-detail-temp.dto';
import { UpdateTicketDetailTempDto } from '../dto/update-ticket-detail-temp.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('ticket-detail-temp')
export class TicketDetailTempController {
    constructor(private readonly ticketDetailTempService: TicketDetailTempService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createTicketDetailTempDto:CreateTicketDetailTempDto){
        return this.ticketDetailTempService.create(createTicketDetailTempDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.ticketDetailTempService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.ticketDetailTempService.findOne(term);
    }

    // @Put(':id')
    // @Authorization(ValidRoles.user)
    // update(
    //   @Param('id',ParseUUIDPipe) id: string,
    //   @Body() updateConceptDto: UpdateConceptDto) {
    //   return this.conceptService.update(id, updateConceptDto);
    // }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.ticketDetailTempService.remove(id);
    }
}
