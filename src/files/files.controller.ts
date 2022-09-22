import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {diskStorage} from 'multer'
import { fileNamer,fileFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService) {}
  @Get(':image')
  findFile(
    @Res() res:Response,
    @Param('image') image:string
  ){
    const path=this.filesService.getStaticImage(image)
    res.sendFile(path);
  }

  @Post()
  @UseInterceptors( FileInterceptor('file',{
    fileFilter:fileFilter,
    limits:{fileSize:1000000*5},
    storage:diskStorage({
      destination:'./static/images',
      filename:fileNamer
    })
  }))
  uploadFile(
    @UploadedFile() file:Express.Multer.File,
    @Body() body){
      if(!file) throw new BadRequestException('Make sure that the file is an image ')
      const {entityRuc}=body
      console.log(entityRuc)
    const secureUrl=`/files/${file.filename}`;  
    return {secureUrl}
  }

}
