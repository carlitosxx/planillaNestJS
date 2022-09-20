import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Condition } from '../entities';
import { CreateConditionDto } from '../dto/create-condition.dto';
import { UpdateConditionDto } from '../dto/update-condition.dto';

@Injectable()
export class ConditionService {
    private readonly logger=new Logger('ConditionService')
    constructor(
        @InjectRepository(Condition)
        private readonly conditionRepository:Repository<Condition>
    ){}
     /**TODO: CREAR */
     async create(createConditionDto:CreateConditionDto){
        try {
            const condition=this.conditionRepository.create(createConditionDto)
            await this.conditionRepository.save(condition);
            return condition;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.conditionRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            conditionCode:1
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
      let condition:Condition
      if(isUUID(term)){
        condition=await this.conditionRepository.findOneBy({conditionId:term})
      }else{      
        const queryBuilder= this.conditionRepository.createQueryBuilder();
        condition=await queryBuilder
          .where('"conditionCode"=:conditionCode or "conditionName"=:conditionName or"conditionDescription"=:conditionDescription',
            {conditionCode:term,conditionName:term,conditionDescription:term}).getOne();
      } 
      if(!condition)  throw new NotFoundException(`Condition with ${term} not found`)
      return condition
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateConditionDto: UpdateConditionDto) {      
        var condition=await this.conditionRepository.preload({
          conditionId:id,
          ...updateConditionDto
        });
        if(!condition) throw new NotFoundException(`Condition with id: ${id} not found`)
      try {  
          await this.conditionRepository.save(condition)        
          return condition       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const condition=await this.findOne(id);
      try {
        await this.conditionRepository.remove(condition)
        return {msg:'deleted condition'}
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
