import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { TypeConceptService } from '../services/type-concept.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Authorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { CreateTypeConceptDto, UpdateTypeConceptDto } from '../dto';

@Controller('type-concept')
export class TypeConceptController {
    constructor(private readonly typeConceptService: TypeConceptService) {}
    @Post()
    @Authorization(ValidRoles.dev)
    create(@Body() createTypeConceptDto:CreateTypeConceptDto){
        return this.typeConceptService.create(createTypeConceptDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.typeConceptService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.typeConceptService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.admin)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateTypeConceptDto: UpdateTypeConceptDto) {
      return this.typeConceptService.update(id, updateTypeConceptDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.typeConceptService.remove(id);
    }
}
