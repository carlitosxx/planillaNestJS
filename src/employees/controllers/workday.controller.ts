import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { WorkdayService } from '../services/workday.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateWorkdayDto } from '../dto/create-workday.dto';
import { UpdateWorkdayDto } from '../dto/update-workday.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('workday')
export class WorkdayController {
    constructor(private readonly workdayService: WorkdayService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createWorkdayDto:CreateWorkdayDto){
        return this.workdayService.create(createWorkdayDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.workdayService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.workdayService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateWorkdayDto: UpdateWorkdayDto) {
      return this.workdayService.update(id, updateWorkdayDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.workdayService.remove(id);
    }
}