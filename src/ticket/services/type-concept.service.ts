import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TypeConcept } from '../entities';
import { CreateTypeConceptDto, UpdateTypeConceptDto } from '../dto';

@Injectable()
export class TypeConceptService {
    private readonly logger=new Logger('TypeConceptService')
    constructor(
        @InjectRepository(TypeConcept)
        private readonly typeConceptRepository:Repository<TypeConcept>
    ){}

    /**TODO: CREAR */
    async create(createTypeConceptDto:CreateTypeConceptDto){
        try {
            const typeConcept=this.typeConceptRepository.create(createTypeConceptDto)
            await this.typeConceptRepository.save(typeConcept);
            return typeConcept;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.typeConceptRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            typeConceptDescription:1
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
        let typeConcept:TypeConcept
        if(isUUID(term)){
            typeConcept=await this.typeConceptRepository.findOneBy({typeConceptId:term})
        }else{      
          const queryBuilder= this.typeConceptRepository.createQueryBuilder();
          typeConcept=await queryBuilder
            .where('"typeConceptDescription"=:typeConceptDescription',
              {typeConceptDescription:term}).getOne();
        } 
        if(!typeConcept)  throw new NotFoundException(`Condition with ${term} not found`)
        return typeConcept
      }
    /**TODO: ACTUALIZAR */
    async update(id: string, updateTypeConceptDto: UpdateTypeConceptDto) {      
        var typeConcept=await this.typeConceptRepository.preload({
            typeConceptId:id,
          ...updateTypeConceptDto
        });
        if(!typeConcept) throw new NotFoundException(`Type concept with id: ${id} not found`)
      try {  
          await this.typeConceptRepository.save(typeConcept)        
          return typeConcept;       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
        const typeConcept=await this.findOne(id);
        try {
          await this.typeConceptRepository.remove(typeConcept)
          return {msg:'deleted typeConcept'}
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
