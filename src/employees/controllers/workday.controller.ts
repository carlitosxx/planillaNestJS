import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { WorkdayService } from '../services/workday.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateWorkdayDto } from '../dto/create-workday.dto';
import { UpdateWorkdayDto } from '../dto/update-workday.dto';

@Controller('workday')
export class WorkdayController {
    constructor(private readonly workdayService: WorkdayService) {}
    @Post()
    create(@Body() createWorkdayDto:CreateWorkdayDto){
        return this.workdayService.create(createWorkdayDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.workdayService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.workdayService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateWorkdayDto: UpdateWorkdayDto) {
      return this.workdayService.update(id, updateWorkdayDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.workdayService.remove(id);
    }
}