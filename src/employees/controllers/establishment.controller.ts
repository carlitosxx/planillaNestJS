import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { EstablishmentService } from '../services/establishment.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';

@Controller('establishment')
export class EstablishmentController {
    constructor(private readonly establishmentService: EstablishmentService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createEstablishmentDto:CreateEstablishmentDto){
        return this.establishmentService.create(createEstablishmentDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.establishmentService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.establishmentService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
      return this.establishmentService.update(id, updateEstablishmentDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.establishmentService.remove(id);
    }
}