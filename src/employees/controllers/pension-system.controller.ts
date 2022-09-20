import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PensionSystemService } from '../services/pension-system.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePensionSystemDto } from '../dto/create-pension-system.dto';
import { UpdatePensionSystemDto } from '../dto/update-pension-system.dto';
@Controller('pension-system')
export class PensionSystemController {
    constructor(private readonly pensionSystemService: PensionSystemService) {}

    @Post()
    create(@Body() createPensionSystemDto:CreatePensionSystemDto){
        return this.pensionSystemService.create(createPensionSystemDto);
    }
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
        return this.pensionSystemService.findAll(paginationDto);
    }
    @Get(':term')
    findOne(@Param('term') term: string) {
    return this.pensionSystemService.findOne(term);
    }
    @Patch(':id')
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updatePensionSystemDto: UpdatePensionSystemDto) {
      return this.pensionSystemService.update(id, updatePensionSystemDto);
    }
    @Delete(':id')
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pensionSystemService.remove(id);
    }
}
