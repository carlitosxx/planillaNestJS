import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Concept } from '../entities';
import { CreateConceptDto, UpdateConceptDto } from '../dto';

@Injectable()
export class ConceptService {
    private readonly logger=new Logger('ConceptService')
    constructor(
        @InjectRepository(Concept)
        private readonly conceptRepository:Repository<Concept>
    ){}
    /**TODO: CREAR */
    async create(createConceptDto:CreateConceptDto){
        try {
            const data=this.conceptRepository.create(createConceptDto)
            await this.conceptRepository.save(data);
            return data;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.conceptRepository.findAndCount({
          take:size,
          skip:calcSkip,
          relations:['typeConcept'],
          order:{
            conceptGlosa:1
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
        let data:Concept
        if(isUUID(term)){
            data=await this.conceptRepository.findOne({where:{conceptId:term},relations:['typeConcept']})
        }else{      
          const queryBuilder= this.conceptRepository.createQueryBuilder('concept');
          data=await queryBuilder
          .leftJoinAndSelect('concept.typeConcept','typeConcept')
            .where('"conceptDescription"=:conceptDescription or "conceptGlosa"=:conceptGlosa',
              {conceptDescription:term,conceptGlosa:term}).getOne();
        } 
        if(!data)  throw new NotFoundException(`The search with ${term} not found`)
        return data
      }

    /**TODO: ACTUALIZAR */
    async update(id: string, udateConceptDto: UpdateConceptDto) {      
        var data=await this.conceptRepository.preload({
            conceptId:id,
          ...udateConceptDto
        });
        if(!data) throw new NotFoundException(`data with id: ${id} not found`)
      try {  
          await this.conceptRepository.save(data)        
          return data;       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
        const data=await this.findOne(id);
        try {
          await this.conceptRepository.remove(data)
          return {msg:'deleted concept'}
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
