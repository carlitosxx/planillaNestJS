import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { ConceptService } from '../services/concept.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateConceptDto } from '../dto/create-concept.dto';
import { UpdateConceptDto } from '../dto/update-concept.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('concept')
export class ConceptController {
    constructor(private readonly conceptService: ConceptService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createConceptDto:CreateConceptDto){
        return this.conceptService.create(createConceptDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.conceptService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.conceptService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateConceptDto: UpdateConceptDto) {
      return this.conceptService.update(id, updateConceptDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.conceptService.remove(id);
    }
}
