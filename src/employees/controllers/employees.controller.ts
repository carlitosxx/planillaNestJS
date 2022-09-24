import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { EmployeesService } from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('employee')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Authorization(ValidRoles.user)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Authorization(ValidRoles.user)
  findAll(@Query()paginationDto:PaginationDto) {    
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':term')
  @Authorization(ValidRoles.user)
  findOne(@Param('term') term: string) {
    return this.employeesService.findOne(term);
  }

  @Put(':id')
  @Authorization(ValidRoles.user)
  update(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Authorization(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }

  
}
