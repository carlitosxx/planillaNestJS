import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { FinancingService } from '../services/financing.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateFinancingDto } from '../dto/create-financing.dto';
import { UpdateFinancingDto } from '../dto/update-financing.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('financing')
export class FinancingController {
    constructor(private readonly financingService: FinancingService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createFinancingDto:CreateFinancingDto){
        return this.financingService.create(createFinancingDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.financingService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.financingService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateFinancingDto: UpdateFinancingDto) {
      return this.financingService.update(id, updateFinancingDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.financingService.remove(id);
    }
}
