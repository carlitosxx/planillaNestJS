import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { PositionService } from '../services/position.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('position')
export class PositionController {
    constructor(private readonly positionService: PositionService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createPositionDto:CreatePositionDto){
        return this.positionService.create(createPositionDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.positionService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.positionService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updatePositionDto: UpdatePositionDto) {
      return this.positionService.update(id, updatePositionDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.positionService.remove(id);
    }
}