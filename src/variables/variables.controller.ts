import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, ParseUUIDPipe } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { Authorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  @Post()
  @Authorization(ValidRoles.user)
  create(@Body() createVariableDto:CreateVariableDto){
      return this.variablesService.create(createVariableDto);
  }

  @Get()
  @Authorization(ValidRoles.user)
  findAll(@Query() paginationDto:PaginationDto){
      return this.variablesService.findAll(paginationDto);
  }
  @Get(':term')
  @Authorization(ValidRoles.user)
  findOne(@Param('term') term: string) {
  return this.variablesService.findOne(term);
  }
  @Put(':id')
  @Authorization(ValidRoles.user)
  update(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updateVariableDto: UpdateVariableDto) {
    return this.variablesService.update(id, updateVariableDto);
  }
  @Delete(':id')
  @Authorization(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
  return this.variablesService.remove(id);
  }
}
