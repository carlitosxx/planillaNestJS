import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Financing } from '../entities';
import { CreateFinancingDto } from '../dto/create-financing.dto';
import { UpdateFinancingDto } from '../dto/update-financing.dto';
@Injectable()
export class FinancingService {
    private readonly logger=new Logger('FinancingService')
    constructor(
        @InjectRepository(Financing)
        private readonly financingRepository:Repository<Financing>
    ){}
     /**TODO: CREAR */
     async create(createFinancingDto:CreateFinancingDto){
        try {
            const condition=this.financingRepository.create(createFinancingDto)
            await this.financingRepository.save(condition);
            return condition;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.financingRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            financingDescription:1
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
      let financing:Financing
      if(isUUID(term)){
        financing=await this.financingRepository.findOneBy({financingId:term})
      }else{      
        const queryBuilder= this.financingRepository.createQueryBuilder();
        financing=await queryBuilder
          .where('"financingDescription"=:financingDescription',
            {financingDescription:term}).getOne();
      } 
      if(!financing)  throw new NotFoundException(`financing with ${term} not found`)
      return financing
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateFinancingDto: UpdateFinancingDto) {      
        var financing=await this.financingRepository.preload({
            financingId:id,
          ...updateFinancingDto
        });
        if(!financing) throw new NotFoundException(`financing with id: ${id} not found`)
      try {  
          await this.financingRepository.save(financing)        
          return financing       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const financing=await this.findOne(id);
      try {
        await this.financingRepository.remove(financing)
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
