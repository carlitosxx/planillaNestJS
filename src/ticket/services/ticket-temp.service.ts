import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TicketTemp } from '../entities';
import { CreateTicketTempDto, UpdateTicketTempDto } from '../dto';

@Injectable()
export class TicketTempService {
    private readonly logger=new Logger('TicketTempService')
    constructor(
        @InjectRepository(TicketTemp)
        private readonly ticketTempRepository:Repository<TicketTemp>
    ){}
    /**TODO: CREAR */
    async create(createTicketTempDto:CreateTicketTempDto){
        try {            
            const data=this.ticketTempRepository.create(createTicketTempDto)
            await this.ticketTempRepository.save(data);
            return data;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.ticketTempRepository.findAndCount({
          take:size,
          skip:calcSkip,
          relations:[
            'entity','responsible','employee','employee.typeEmployee',
            'employee.organicUnit','employee.condition','employee.laborRegime','employee.occupationalGroup',
            'employee.establishment','employee.position','employee.workday','employee.salary','employee.salary.employeeCategory','employee.pensionAdministrator','employee.pensionAdministrator.pensionSystem'],
          order:{
            ticketTempCorrelative:1
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
      
        let data:TicketTemp
        if(isUUID(term)){
            data=await this.ticketTempRepository.findOne({
                where:{ticketTempId:term},
                relations:['entity','responsible']})
        }else{      
          console.log('pase por aqui');
          const queryBuilder= this.ticketTempRepository.createQueryBuilder('ticketTemp');
          data=await queryBuilder
            // .leftJoinAndSelect('ticketTemp.employee','employee')
            // .leftJoinAndSelect('ticketTemp.entity','entity')
            // .leftJoinAndSelect('ticketTemp.responsible','responsible')
            .where('"ticketTempCorrelative"=:ticketTempCorrelative',
              {ticketTempCorrelative:term}).getOne();
        } 
        if(!data)  throw new NotFoundException(`The search with ${term} not found`)
        return data
      }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateTicketTempDto: UpdateTicketTempDto) {      
        var data=await this.ticketTempRepository.preload({
            ticketTempId:id,
          ...updateTicketTempDto
        });
        if(!data) throw new NotFoundException(`The search with id: ${id} not found`)
      try {  
          await this.ticketTempRepository.save(data)        
          return data;       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
        const data=await this.findOne(id);
        try {
          await this.ticketTempRepository.remove(data)
          return {msg:'deleted ticket temp'}
        } catch (error) {        
          this.handleDBExceptions(error)
        }
      }
     /**TODO: ATRAPAR ERRORES DE BD */
     private handleDBExceptions(error:any){   
        console.log(error) 
        if(error.code==='23505' || error.code==='23503')
          throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs')
    }
}
