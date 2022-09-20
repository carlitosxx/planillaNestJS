import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrganicUnitService } from '../services/organic-unit.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateOrganicUnitDto } from '../dto/create-organic-unit.dto';
import { UpdateOrganicUnitDto } from '../dto/update-organic-unit.dto';
@Controller('organic-unit')
export class OrganicUnitController {
    constructor(private readonly organicUnitService: OrganicUnitService) {}

    @Post()
    create(@Body() createOrganicUnitDto:CreateOrganicUnitDto){
        return this.organicUnitService.create(createOrganicUnitDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.organicUnitService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.organicUnitService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateOrganicUnitDto: UpdateOrganicUnitDto) {
      return this.organicUnitService.update(id, updateOrganicUnitDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.organicUnitService.remove(id);
    }
}
