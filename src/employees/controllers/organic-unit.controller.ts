import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { OrganicUnitService } from '../services/organic-unit.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateOrganicUnitDto } from '../dto/create-organic-unit.dto';
import { UpdateOrganicUnitDto } from '../dto/update-organic-unit.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('organic-unit')
export class OrganicUnitController {
    constructor(private readonly organicUnitService: OrganicUnitService) {}

    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createOrganicUnitDto:CreateOrganicUnitDto){
        return this.organicUnitService.create(createOrganicUnitDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.organicUnitService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.organicUnitService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateOrganicUnitDto: UpdateOrganicUnitDto) {
      return this.organicUnitService.update(id, updateOrganicUnitDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.organicUnitService.remove(id);
    }
}
