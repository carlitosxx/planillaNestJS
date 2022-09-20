import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
// import { create } from 'domain';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTypeEmployeeDto } from '../dto/create-type-employee.dto';
import { UpdateTypeEmployeeDto } from '../dto/update-type-employee.dto';
import { TypeEmployeeService } from '../services/type-employee.service';

@Controller('type-employee')
export class TypeEmployeeController {
    constructor(private readonly typeEmployeeService: TypeEmployeeService) {}
    @Post()
    create(@Body() createTypeEmployeeDto:CreateTypeEmployeeDto){
        return this.typeEmployeeService.create(createTypeEmployeeDto)
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.typeEmployeeService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.typeEmployeeService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateTypeEmployeeDto: UpdateTypeEmployeeDto) {
      return this.typeEmployeeService.update(id, updateTypeEmployeeDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.typeEmployeeService.remove(id);
    }
}

