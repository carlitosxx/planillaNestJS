import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { EmployeeCategoryService } from '../services/employee-category.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateEmployeeCategoryDto } from '../dto/create-employee-category.dto';
import { UpdateEmployeeCategoryDto } from '../dto/update-employee-category.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('employee-category')
export class EmployeeCategoryController {
    constructor(private readonly employeeCategoryService: EmployeeCategoryService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createConditionDto:CreateEmployeeCategoryDto){
        return this.employeeCategoryService.create(createConditionDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.employeeCategoryService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.employeeCategoryService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateEmployeeCategoryDto: UpdateEmployeeCategoryDto) {
      return this.employeeCategoryService.update(id, updateEmployeeCategoryDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.employeeCategoryService.remove(id);
    }
}
