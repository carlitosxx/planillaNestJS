import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { TicketTempService } from '../services/ticket-temp.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTicketTempDto,UpdateTicketTempDto } from '../dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('ticket-temp')
export class TicketTempController {
    constructor(private readonly ticketTempService: TicketTempService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createTicketTempDto:CreateTicketTempDto){
        return this.ticketTempService.create(createTicketTempDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.ticketTempService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.ticketTempService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateConceptDto: UpdateTicketTempDto) {
      return this.ticketTempService.update(id, updateConceptDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.ticketTempService.remove(id);
    }
}
