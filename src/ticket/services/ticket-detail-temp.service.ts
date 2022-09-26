import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TicketDetailTemp } from '../entities';
import { CreateTicketDetailTempDto, UpdateTicketDetailTempDto } from '../dto';

@Injectable()
export class TicketDetailTempService {
    private readonly logger=new Logger('TicketDetailTempService')
    constructor(
        @InjectRepository(TicketDetailTemp)
        private readonly ticketDetailTempRepository:Repository<TicketDetailTemp>
    ){}
    /**TODO: CREAR */
    async create(createTicketDetailTempDto:CreateTicketDetailTempDto){
        try {
            const data=this.ticketDetailTempRepository.create(createTicketDetailTempDto)
            await this.ticketDetailTempRepository.save(data);
            return data;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.ticketDetailTempRepository.findAndCount({
          take:size,
          skip:calcSkip,
          // relations:['concept'],                 
        }
        )    
        return {
          total:query[1],
          data:query[0]
        }
    }
    /**TODO: BUSCAR POR: */
    async findOne(term: string) {
        let data:TicketDetailTemp
        if(isUUID(term)){
            data=await this.ticketDetailTempRepository.findOne({
                where:{ticketTempCorrelative:term},
                relations:['concept']})
        }else{      
          const queryBuilder= this.ticketDetailTempRepository.createQueryBuilder('ticketDetailTemp');
          data=await queryBuilder
          .leftJoinAndSelect('ticketDetailTemp.concept','concept')
            .where('"ticketTempCorrelative"=:ticketTempCorrelative',
              {ticketTempCorrelative:term}).getOne();
        } 
        if(!data)  throw new NotFoundException(`The search with ${term} not found`)
        return data
      }

    /**TODO: ACTUALIZAR */
    // async update(id: string, updateTicketDetailTempDto: UpdateTicketDetailTempDto) {      
    //     var data=await this.ticketDetailTempRepository.preload({
    //         conceptId:id,
    //       ...UpdateTicketDetailTempDto
    //     });
    //     if(!data) throw new NotFoundException(`data with id: ${id} not found`)
    //   try {  
    //       await this.ticketDetailTempRepository.save(data)        
    //       return data;       
    //   } catch (error) {      
    //     this.handleDBExceptions(error)
    //   }
    // }
    /**TODO: BORRAR */
    async remove(id: string) {
        const data=await this.findOne(id);
        try {
          await this.ticketDetailTempRepository.remove(data)
          return {msg:'deleted detail'}
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
