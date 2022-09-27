import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Correlative, TicketDetailTemp, TicketTemp } from '../entities';
import { CreateTicketTempDto, UpdateTicketTempDto } from '../dto';

@Injectable()
export class TicketTempService {
    private readonly logger=new Logger('TicketTempService')
    constructor(
        @InjectRepository(TicketTemp)
        private readonly ticketTempRepository:Repository<TicketTemp>,
        @InjectRepository(Correlative)
        private readonly correlativeRepository:Repository<Correlative>,
        @InjectRepository(TicketDetailTemp)
        private readonly ticketDetailTempRepository:Repository<TicketDetailTemp>,
    ){}
    /**TODO: CREAR */
    async create(createTicketTempDto:CreateTicketTempDto){   
      const currentTime = new Date();
      const year:number = currentTime.getFullYear()
      const verifyMonthYear=await this.ticketTempRepository.findOne({
        where:{
          ticketTempMonth:createTicketTempDto.ticketTempMonth,
          ticketTempYear:createTicketTempDto.ticketTempYear
        }
      })
      // console.log(verifyMonthYear)
      if(verifyMonthYear) throw new BadRequestException('The employee has a ticket in this Date')
      const correlative= await this.correlativeRepository.findOne({
        where:{
            correlativeYear:year,
            correlativeSerie:"t"}
        })
      if(!correlative) throw new NotFoundException(`correlative with serie: t and year:${year} not found`) 

      const numberToString= (correlative.correlativeNumber+1).toString().padStart(5,'0');
      createTicketTempDto.ticketTempCorrelative=
      `${correlative.correlativeSerie}${correlative.correlativeYear}-${numberToString}`      
          const verifyTicket=await this.ticketTempRepository.findBy({ticketTempCorrelative:createTicketTempDto.ticketTempCorrelative})
          if(verifyTicket.length!=0) throw new  BadRequestException(`Key ("ticketTempCorrelative")=(${createTicketTempDto.ticketTempCorrelative}) already exists.`) 
        try {           
            const data=this.ticketTempRepository.create(createTicketTempDto)
            await this.ticketTempRepository.save(data);    
            await this.correlativeRepository.update({ 
              correlativeYear: year,
              correlativeSerie:"t"},
              {
                correlativeNumber:correlative.correlativeNumber+1
              })          
            return data;
        } catch (error) {
          console.log('error')
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
            'employee.establishment','employee.position','employee.workday','employee.salary',
            'employee.salary.employeeCategory','employee.pensionAdministrator','employee.pensionAdministrator.pensionSystem'],
          order:{
            ticketTempCorrelative:1
          }         
        })        
        const data= await Promise.all(query[0].map(async (element:any)=> {
          const arrayConcepts=  await this.ticketDetailTempRepository.find({
              where:{
                ticketTempCorrelative:element.ticketTempCorrelative
              }
            })            
            element.concepts=arrayConcepts;            
            return element
          })) 
        return {
          total:query[1],
          data
        }
    }
    /**TODO: BUSCAR POR: */
    async findOne(term: string) {      
        let data:TicketTemp                 
          const queryBuilder= this.ticketTempRepository.createQueryBuilder('ticketTemp');
          data=await queryBuilder
            .leftJoinAndSelect('ticketTemp.employee','employee')
            .leftJoinAndSelect('ticketTemp.entity','entity')
            .leftJoinAndSelect('ticketTemp.responsible','responsible')
            .where('"ticketTempCorrelative"=:ticketTempCorrelative',
              {ticketTempCorrelative:term}).getOne();        
        if(!data)  throw new NotFoundException(`The search with ${term} not found`)    
        const arrayConcepts=  await this.ticketDetailTempRepository.find({
                where:{
                  ticketTempCorrelative:data.ticketTempCorrelative
                }
              })    
        const newData:any=data;
        newData.concetps=arrayConcepts
        return newData
      }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateTicketTempDto: UpdateTicketTempDto) {      
        var data=await this.ticketTempRepository.preload({
            ticketTempCorrelative:id,
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
