import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ConditionService } from '../services/condition.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateConditionDto } from '../dto/create-condition.dto';
import { UpdateConditionDto } from '../dto/update-condition.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('condition')
export class ConditionController {
    constructor(private readonly conditionService: ConditionService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createConditionDto:CreateConditionDto){
        return this.conditionService.create(createConditionDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.conditionService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.conditionService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateConditionDto: UpdateConditionDto) {
      return this.conditionService.update(id, updateConditionDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.conditionService.remove(id);
    }
}
