import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Responsible } from '../entities';
import { CreateResponsibleDto } from '../dto/create-responsible.dto';
import { UpdateResponsibleDto } from '../dto/update-responsible.dto';
import { join } from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const unlinkAsync=promisify(fs.unlink)

@Injectable()
export class ResponsibleService {
    private readonly logger=new Logger('ResponsibleService')
    constructor(
        @InjectRepository(Responsible)
        private readonly responsibleRepository:Repository<Responsible>
    ){}
     /**TODO: CREAR */
     async create(createResponsibleDto,file){
      createResponsibleDto.responsibleSignature=file.filename
      console.log(createResponsibleDto.responsibleStatus)
      if(createResponsibleDto.responsibleStatus==="1"){
        const directory=join(__dirname,'../../..','static/images',file.filename)        
        await unlinkAsync(directory);
        throw new BadRequestException('change you responsibleStatus to 0')
      } 
        try {
            const responsible=this.responsibleRepository.create(createResponsibleDto)
            await this.responsibleRepository.save(responsible);
            return responsible;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.responsibleRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            responsibleFullname:1
          }         
        }
        )   
        const remap =  query[0].map((element)=>{
          element.responsibleSignature='/files/'+element.responsibleSignature
        })    
        return {
          total:query[1],
          data:query[0]
        }
    }

     /**TODO: BUSCAR POR: */
    async findOne(term: string) {
      let responsible:Responsible
      if(isUUID(term)){
        responsible=await this.responsibleRepository.findOneBy({responsibleId:term})
      }else{      
        const queryBuilder= this.responsibleRepository.createQueryBuilder();
        responsible=await queryBuilder
          .where('"responsibleFullname"=:responsibleFullname or "responsibleDni"=:responsibleDni',
            {responsibleFullname:term,responsibleDni:term}).getOne();
      } 
      if(!responsible)  throw new NotFoundException(`responsible with ${term} not found`)
      responsible.responsibleSignature='/files/'+responsible.responsibleSignature;
      return responsible
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateResponsibleDto: UpdateResponsibleDto) {      
        var responsible=await this.responsibleRepository.preload({
            responsibleId:id,
          ...updateResponsibleDto
        });
        if(!responsible) throw new NotFoundException(`responsible with id: ${id} not found`)
      try {  
          await this.responsibleRepository.save(responsible)        
          return responsible       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const financing=await this.findOne(id);
      try {
        await this.responsibleRepository.remove(financing)
        return {msg:'deleted financing'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }

    /**TODO: ATRAPAR ERRORES DE BD */
    private handleDBExceptions(error:any){    
        if(error.code==='23505' || error.code==='23503')
          throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs')
    }
}
