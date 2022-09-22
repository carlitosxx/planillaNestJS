import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { Authorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
// import { create } from 'domain';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTypeEmployeeDto } from '../dto/create-type-employee.dto';
import { UpdateTypeEmployeeDto } from '../dto/update-type-employee.dto';
import { TypeEmployeeService } from '../services/type-employee.service';

@Controller('type-employee')
export class TypeEmployeeController {
    constructor(private readonly typeEmployeeService: TypeEmployeeService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createTypeEmployeeDto:CreateTypeEmployeeDto){
        return this.typeEmployeeService.create(createTypeEmployeeDto)
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.typeEmployeeService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.typeEmployeeService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateTypeEmployeeDto: UpdateTypeEmployeeDto) {
      return this.typeEmployeeService.update(id, updateTypeEmployeeDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.typeEmployeeService.remove(id);
    }
}

