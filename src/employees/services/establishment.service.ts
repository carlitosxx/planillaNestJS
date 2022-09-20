import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Establishment } from '../entities';
import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';

@Injectable()
export class EstablishmentService {
    private readonly logger=new Logger('EstablishmentService')
    constructor(
        @InjectRepository(Establishment)
        private readonly establishmentRepository:Repository<Establishment>
    ){}
     /**TODO: CREAR */
     async create(createEstablishmentDto:CreateEstablishmentDto){
        try {
            const establishment=this.establishmentRepository.create(createEstablishmentDto)
            await this.establishmentRepository.save(establishment);
            return establishment;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.establishmentRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            establishmentCode:1
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
      let establishment:Establishment
      if(isUUID(term)){
        establishment=await this.establishmentRepository.findOneBy({establishmentId:term})
      }else{      
        const queryBuilder= this.establishmentRepository.createQueryBuilder();
        establishment=await queryBuilder
          .where('"establishmentCode"=:establishmentCode or "establishmentName"=:establishmentName or"establishmentDescription"=:conditionDescription',
            {establishmentCode:term,establishmentName:term,establishmentDescription:term}).getOne();
      } 
      if(!establishment)  throw new NotFoundException(`Establishment with ${term} not found`)
      return establishment
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateEstablishmentDto: UpdateEstablishmentDto) {      
        var establishment=await this.establishmentRepository.preload({
          establishmentId:id,
          ...updateEstablishmentDto
        });
        if(!establishment) throw new NotFoundException(`Establishment with id: ${id} not found`)
      try {  
          await this.establishmentRepository.save(establishment)        
          return establishment       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const establishment=await this.findOne(id);
      try {
        await this.establishmentRepository.remove(establishment)
        return {msg:'deleted establishment'}
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
