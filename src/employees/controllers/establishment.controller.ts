import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { EstablishmentService } from '../services/establishment.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';

@Controller('establishment')
export class EstablishmentController {
    constructor(private readonly establishmentService: EstablishmentService) {}
    @Post()
    create(@Body() createEstablishmentDto:CreateEstablishmentDto){
        return this.establishmentService.create(createEstablishmentDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.establishmentService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.establishmentService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
      return this.establishmentService.update(id, updateEstablishmentDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.establishmentService.remove(id);
    }
}