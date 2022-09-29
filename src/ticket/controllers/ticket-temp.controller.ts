import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { TicketTempService } from '../services/ticket-temp.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTicketTempDto,UpdateTicketTempDto } from '../dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
import { CreateBatchTicketTemp } from '../dto/create-batch-ticket-temp.dto';
import { query } from 'express';
import { UpdateArrayOfDayWorkedDelay } from '../dto/Update-array-of-day-worked-delay.dto';

@Controller('ticket-temp')
export class TicketTempController {
    constructor(private readonly ticketTempService: TicketTempService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createTicketTempDto:CreateTicketTempDto){
        return this.ticketTempService.create(createTicketTempDto);
    }
    @Post('batch')
    @Authorization(ValidRoles.user)
    createBatch(@Body() createBatchTicketTemp:CreateBatchTicketTemp){
        return this.ticketTempService.createBatch(createBatchTicketTemp);
    }
    @Post('update-days-worked-delay')
    @Authorization(ValidRoles.user)
    updateDaysWorkedDelay(@Body() updateArrayOfDayWorkedDelay:UpdateArrayOfDayWorkedDelay){
        return this.ticketTempService.updateDaysWorkedDelay(updateArrayOfDayWorkedDelay)
    }


    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.ticketTempService.findAll(paginationDto);
    }
    @Get('by-year-month')
    @Authorization(ValidRoles.user)
    findByYearMonth(@Query('year') year,@Query('month') month){
        return this.ticketTempService.findByYearMonth(year,month)
    }

    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.ticketTempService.findOne(term);
    }
    @Put(':id')
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
