import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { LaborRegime } from '../entities';
import { CreateLaborRegimeDto } from '../dto/create-labor-regime.dto';
import { UpdateLaborRegimeDto } from '../dto/update-labor-regime.dto';

@Injectable()
export class LaborRegimeService {
    private readonly logger=new Logger('LaborRegimeService')
    constructor(
        @InjectRepository(LaborRegime)
        private readonly laborRegimeRepository:Repository<LaborRegime>
    ){}
     /**TODO: CREAR */
     async create(createLaborRegimeDto:CreateLaborRegimeDto){
        try {
            const laborRegime=this.laborRegimeRepository.create(createLaborRegimeDto)
            await this.laborRegimeRepository.save(laborRegime);
            return laborRegime;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.laborRegimeRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            laborRegimeCode:1
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
      let laborRegime:LaborRegime
      if(isUUID(term)){
        laborRegime=await this.laborRegimeRepository.findOneBy({laborRegimeId:term})
      }else{      
        const queryBuilder= this.laborRegimeRepository.createQueryBuilder();
        laborRegime=await queryBuilder
          .where('"laborRegimeCode"=:laborRegimeCode or "laborRegimeName"=:laborRegimeName or"laborRegimeDescription"=:laborRegimeDescription',
            {laborRegimeCode:term,laborRegimeName:term,laborRegimeDescription:term}).getOne();
      } 
      if(!laborRegime)  throw new NotFoundException(`LaborRegime with ${term} not found`)
      return laborRegime
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateLaborRegimeDto: UpdateLaborRegimeDto) {      
        var laborRegime=await this.laborRegimeRepository.preload({
            laborRegimeId:id,
          ...updateLaborRegimeDto
        });
        if(!laborRegime) throw new NotFoundException(`LaborRegime with id: ${id} not found`)
      try {  
          await this.laborRegimeRepository.save(laborRegime)        
          return laborRegime       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const laborRegime=await this.findOne(id);
      try {
        await this.laborRegimeRepository.remove(laborRegime)
        return {msg:'deleted laborRegime'}
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
