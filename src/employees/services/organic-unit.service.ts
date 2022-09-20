import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OrganicUnit } from '../entities/organicUnit.entity';
import { CreateOrganicUnitDto } from '../dto/create-organic-unit.dto';
import { UpdateOrganicUnitDto } from '../dto/update-organic-unit.dto';
@Injectable()
export class OrganicUnitService {
    private readonly logger=new Logger('OrganicUnitService')
    constructor(
        @InjectRepository(OrganicUnit)
        private readonly organicUnitRepository:Repository<OrganicUnit>
    ){}

    /**TODO: CREAR */
    async create(createOrganicUnitDto:CreateOrganicUnitDto){
        try {
            const typeEmployee=this.organicUnitRepository.create(createOrganicUnitDto)
            await this.organicUnitRepository.save(typeEmployee);
            return typeEmployee;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.organicUnitRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            organicUnitCode:1
          }         
        }
        )    
        return {
          total:query[1],
          data:query[0]
        }
    }

     /**TODO: BUSCAR POR: */
    async findOne(term: string) {
      let organicUnit:OrganicUnit
      if(isUUID(term)){
        organicUnit=await this.organicUnitRepository.findOneBy({organicUnitId:term})
      }else{      
        const queryBuilder= this.organicUnitRepository.createQueryBuilder();
        organicUnit=await queryBuilder
          .where('"organicUnitCode"=:organicUnitCode or "organicUnitDescription"=:organicUnitDescription',
            {organicUnitCode:term,organicUnitDescription:term}).getOne();
      } 
      if(!organicUnit)  throw new NotFoundException(`Organic unit with ${term} not found`)
      return organicUnit
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateOrganicUnitDto: UpdateOrganicUnitDto) {      
        var organicUnit=await this.organicUnitRepository.preload({
          organicUnitId:id,
          ...updateOrganicUnitDto
        });
        if(!organicUnit) throw new NotFoundException(`Organic Unit with id: ${id} not found`)
      try {  
          await this.organicUnitRepository.save(organicUnit)        
          return organicUnit       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const organicUnit=await this.findOne(id);
      try {
        await this.organicUnitRepository.remove(organicUnit)
        return {msg:'deleted organic unit'}
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
