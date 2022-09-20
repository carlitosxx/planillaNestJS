import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OccupationalGroupService } from '../services/occupational-group.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateOccupationalGroupDto } from '../dto/create-occupational-group.dto';
import { UpdateOccupationalGroupDto } from '../dto/update-occupational-group.dto';

@Controller('occupational-group')
export class OccupationalGroupController {
    constructor(private readonly occupationalGroupService: OccupationalGroupService) {}
    @Post()
    create(@Body() createOccupationalGroupDto:CreateOccupationalGroupDto){
        return this.occupationalGroupService.create(createOccupationalGroupDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.occupationalGroupService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.occupationalGroupService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateOccupationalGroupDto: UpdateOccupationalGroupDto) {
      return this.occupationalGroupService.update(id, updateOccupationalGroupDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.occupationalGroupService.remove(id);
    }
}