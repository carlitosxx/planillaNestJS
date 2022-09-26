import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { CorrelativeService } from '../services/correlative.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateCorrelativeDto,UpdateCorrelativeDto } from '../dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
import { CorrelativeParamDto } from '../dto/correlative-param.dto';

@Controller('correlative')
export class CorrelativeController {
    constructor(private readonly correlativeService: CorrelativeService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createCorrelativeDto:CreateCorrelativeDto){
        return this.correlativeService.create(createCorrelativeDto);
    }
   
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() correlativeParamDto:CorrelativeParamDto){
        return this.correlativeService.findOne(correlativeParamDto);
    }
    @Put(':correlativeYear/:correlativeSerie')
    @Authorization(ValidRoles.user)
    update(
      @Param('correlativeYear') correlativeYear: number,
      @Param('correlativeSerie') correlativeSerie:string,
      @Body() updateCorrelativeDto: UpdateCorrelativeDto) {
      return this.correlativeService.update(correlativeSerie.toLowerCase(),correlativeYear, updateCorrelativeDto);
    }
    // @Delete(':id')
    // @Authorization(ValidRoles.admin)
    // remove(@Param('id',ParseUUIDPipe) id: string) {
    // return this.correlativeService.remove(id);
    // }
}