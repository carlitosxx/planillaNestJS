import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PositionService } from '../services/position.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Controller('position')
export class PositionController {
    constructor(private readonly positionService: PositionService) {}
    @Post()
    create(@Body() createPositionDto:CreatePositionDto){
        return this.positionService.create(createPositionDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.positionService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.positionService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updatePositionDto: UpdatePositionDto) {
      return this.positionService.update(id, updatePositionDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.positionService.remove(id);
    }
}