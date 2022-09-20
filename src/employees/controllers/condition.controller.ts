import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ConditionService } from '../services/condition.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateConditionDto } from '../dto/create-condition.dto';
import { UpdateConditionDto } from '../dto/update-condition.dto';
@Controller('condition')
export class ConditionController {
    constructor(private readonly conditionService: ConditionService) {}
    @Post()
    create(@Body() createConditionDto:CreateConditionDto){
        return this.conditionService.create(createConditionDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.conditionService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.conditionService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateConditionDto: UpdateConditionDto) {
      return this.conditionService.update(id, updateConditionDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.conditionService.remove(id);
    }
}
