import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { LaborRegimeService } from '../services/labor-regime.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateLaborRegimeDto } from '../dto/create-labor-regime.dto';
import { UpdateLaborRegimeDto } from '../dto/update-labor-regime.dto';

@Controller('labor-regime')
export class LaborRegimeController {
    constructor(private readonly laborRegimeService: LaborRegimeService) {}
    @Post()
    create(@Body() createConditionDto:CreateLaborRegimeDto){
        return this.laborRegimeService.create(createConditionDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.laborRegimeService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.laborRegimeService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateLaborRegimeDto: UpdateLaborRegimeDto) {
      return this.laborRegimeService.update(id, updateLaborRegimeDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.laborRegimeService.remove(id);
    }
}