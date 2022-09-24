import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { OccupationalGroupService } from '../services/occupational-group.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateOccupationalGroupDto } from '../dto/create-occupational-group.dto';
import { UpdateOccupationalGroupDto } from '../dto/update-occupational-group.dto';
import { Authorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('occupational-group')
export class OccupationalGroupController {
    constructor(private readonly occupationalGroupService: OccupationalGroupService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createOccupationalGroupDto:CreateOccupationalGroupDto){
        return this.occupationalGroupService.create(createOccupationalGroupDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.occupationalGroupService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.occupationalGroupService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateOccupationalGroupDto: UpdateOccupationalGroupDto) {
      return this.occupationalGroupService.update(id, updateOccupationalGroupDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.occupationalGroupService.remove(id);
    }
}