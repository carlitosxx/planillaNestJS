import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { EntityService } from '../services/entity.service';
import { CreateEntityDto } from '../dto/create-entity.dto';
import { UpdateEntityDto } from '../dto/update-entity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/files/helpers';
import {diskStorage} from 'multer'
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}
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
    @Body() createEntityDto) {
      if(!file) throw new BadRequestException('Make sure that the file is an image ')
    return this.entityService.create(createEntityDto,file);
  }
  @Get()
  @Authorization(ValidRoles.user)
  findAll(@Query() paginationDto:PaginationDto){
      return this.entityService.findAll(paginationDto);
  }
  @Get(':term')
  @Authorization(ValidRoles.user)
  findOne(@Param('term') term: string) {
  return this.entityService.findOne(term);
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
    @Body() updateEntityDto)
  {
      if(!file) throw new BadRequestException('Make sure that the file is an image ')
      return this.entityService.update(id, updateEntityDto,file);
  }
  @Delete(':id')
  @Authorization(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
  return this.entityService.remove(id);
  }
}
