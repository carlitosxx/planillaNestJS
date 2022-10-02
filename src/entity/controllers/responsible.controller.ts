import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, BadRequestException, Put } from '@nestjs/common';
import { ResponsibleService } from '../services/responsible.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateResponsibleDto } from '../dto/create-responsible.dto';
import { UpdateResponsibleDto } from '../dto/update-responsible.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/files/helpers';
import {diskStorage} from 'multer'
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('responsible')
export class ResponsibleController {
    constructor(private readonly responsibleService: ResponsibleService) {}

    @Post()
    @Authorization(ValidRoles.user)
    @UseInterceptors( FileInterceptor('file',{
        fileFilter:fileFilter,
        limits:{fileSize:1000000*5},
        storage:diskStorage({
          destination:'./static/images',
          filename:fileNamer
        })
      }))
    create(
        @UploadedFile() file:Express.Multer.File,
        @Body() createResponsibleDto){
            if(!file) throw new BadRequestException('Make sure that the file is an image ')
        return this.responsibleService.create(createResponsibleDto,file);
    }

    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.responsibleService.findAll(paginationDto);
    }
    
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.responsibleService.findOne(term);
    }

    @Put(':id')
    @Authorization(ValidRoles.user)
    @UseInterceptors( FileInterceptor('file',{
      fileFilter:fileFilter,
      limits:{fileSize:1000000*5},
      storage:diskStorage({
        destination:'./static/images',
        filename:fileNamer
      })
    }))
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @UploadedFile() file:Express.Multer.File,
      @Body() updateResponsibleDto) {        
      return this.responsibleService.update(id, updateResponsibleDto,file);
    }

    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.responsibleService.remove(id);
    }
}
