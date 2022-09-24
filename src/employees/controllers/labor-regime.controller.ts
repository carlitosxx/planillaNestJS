import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { LaborRegimeService } from '../services/labor-regime.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateLaborRegimeDto } from '../dto/create-labor-regime.dto';
import { UpdateLaborRegimeDto } from '../dto/update-labor-regime.dto';
import { Authorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('labor-regime')
export class LaborRegimeController {
    constructor(private readonly laborRegimeService: LaborRegimeService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createLaborRegimeDto:CreateLaborRegimeDto){
        return this.laborRegimeService.create(createLaborRegimeDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.laborRegimeService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.laborRegimeService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateLaborRegimeDto: UpdateLaborRegimeDto) {
      return this.laborRegimeService.update(id, updateLaborRegimeDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.laborRegimeService.remove(id);
    }
}