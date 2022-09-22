import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PensionAdministratorService } from '../services/pension-administrator.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePensionAdministratorDto } from '../dto/create-pensionAdministrator.dto';
import { UpdatePensionAdministratorDto } from '../dto/update-pensionAdministrator.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('pension-administrator')
export class PensionAdministratorController {
    constructor(private readonly pensionAdministratorService: PensionAdministratorService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createPensionAdministratorDto:CreatePensionAdministratorDto){
        return this.pensionAdministratorService.create(createPensionAdministratorDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.pensionAdministratorService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.pensionAdministratorService.findOne(term);
    }
    @Patch(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updatePensionAdministratorDto: UpdatePensionAdministratorDto) {
      return this.pensionAdministratorService.update(id, updatePensionAdministratorDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pensionAdministratorService.remove(id);
    }
}