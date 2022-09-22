import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SalaryService } from '../services/salary.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSalaryDto } from '../dto/create-salary.dto';
import { UpdateSalaryDto } from '../dto/update-salary.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('salary')
export class SalaryController {
    constructor(private readonly salaryService: SalaryService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createSalaryDto:CreateSalaryDto){
        return this.salaryService.create(createSalaryDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.salaryService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.salaryService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateSalaryDto: UpdateSalaryDto) {
      return this.salaryService.update(id, updateSalaryDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.user)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.salaryService.remove(id);
    }
}