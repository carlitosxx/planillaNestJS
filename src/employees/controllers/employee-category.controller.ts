import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { EmployeeCategoryService } from '../services/employee-category.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateEmployeeCategoryDto } from '../dto/create-employee-category.dto';
import { UpdateEmployeeCategoryDto } from '../dto/update-employee-category.dto';
@Controller('employee-category')
export class EmployeeCategoryController {
    constructor(private readonly employeeCategoryService: EmployeeCategoryService) {}
    @Post()
    create(@Body() createConditionDto:CreateEmployeeCategoryDto){
        return this.employeeCategoryService.create(createConditionDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.employeeCategoryService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.employeeCategoryService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateEmployeeCategoryDto: UpdateEmployeeCategoryDto) {
      return this.employeeCategoryService.update(id, updateEmployeeCategoryDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.employeeCategoryService.remove(id);
    }
}
