import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SalaryService } from '../services/salary.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSalaryDto } from '../dto/create-salary.dto';
import { UpdateSalaryDto } from '../dto/update-salary.dto';
@Controller('salary')
export class SalaryController {
    constructor(private readonly salaryService: SalaryService) {}
    @Post()
    create(@Body() createSalaryDto:CreateSalaryDto){
        return this.salaryService.create(createSalaryDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.salaryService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.salaryService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateSalaryDto: UpdateSalaryDto) {
      return this.salaryService.update(id, updateSalaryDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.salaryService.remove(id);
    }
}