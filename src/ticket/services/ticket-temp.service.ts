import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Correlative, TicketDetailTemp, TicketTemp } from '../entities';
import { CreateTicketTempDto, UpdateTicketTempDto } from '../dto';
import { CreateBatchTicketTemp } from '../dto/create-batch-ticket-temp.dto';
import { Employee } from 'src/employees/entities';
import { Entitie } from 'src/entity/entities';

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
      let verifyMonthYear: TicketTemp;  
      try {
        // VERIFICAR SI EXISTE UNA BOLETA EN ESE MES Y AÑO
        verifyMonthYear=await this.ticketTempRepository.findOne({
          where:{  
            employee:{employeeId:createTicketTempDto.employee.toString()},          
            ticketTempMonth:createTicketTempDto.ticketTempMonth,
            ticketTempYear:createTicketTempDto.ticketTempYear,          
          }
        })            
      } catch (error) {       
        this.handleDBExceptions(error);
      }            
      if(verifyMonthYear) throw new BadRequestException('The employee has a ticket in this Date')
      //OBTENER EL CORRELATIVO
      const correlative= await this.correlativeRepository.findOne({
        where:{
            correlativeYear:createTicketTempDto.ticketTempYear,
            correlativeSerie:"t"}
        })
      if(!correlative) throw new NotFoundException(`correlative with serie: t and year:${createTicketTempDto.ticketTempYear} not found`)      
      const numberToString= (correlative.correlativeNumber+1).toString().padStart(5,'0');
      //ARMAR EL CORRELATIVO CON AÑO Y SERIE
      createTicketTempDto.ticketTempCorrelative=`${correlative.correlativeSerie}${correlative.correlativeYear}-${numberToString}`      
      const verifyTicket=await this.ticketTempRepository.findBy({ticketTempCorrelative:createTicketTempDto.ticketTempCorrelative})
      if(verifyTicket.length!=0) throw new  BadRequestException(
      `Key ("ticketTempCorrelative")=(${createTicketTempDto.ticketTempCorrelative}) already exists.`) 
        try {           
            const data=this.ticketTempRepository.create(createTicketTempDto)
            await this.ticketTempRepository.save(data);    
            await this.correlativeRepository.update({ 
              correlativeYear: createTicketTempDto.ticketTempYear,
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
    /**TODO: CREAR POR LOTE */
    async createBatch(createBatchTicketTemp:CreateBatchTicketTemp){
      for (const element of createBatchTicketTemp.employees) {
        let verifyMonthYear: TicketTemp;  
        let newTicket=new CreateTicketTempDto();
        let employee=new Employee();
        employee.employeeId=element;
        newTicket.employee=employee;
        // newTicket.employee=element;
        newTicket.entity=createBatchTicketTemp.entity;
        newTicket.responsible=createBatchTicketTemp.responsible;
        newTicket.ticketTempDaysWorked=30;
        newTicket.ticketTempDaysNotWorked=0;
        newTicket.ticketTempDaysSubsidized=0;
        newTicket.ticketTempMonth=createBatchTicketTemp.ticketTempMonth;
        newTicket.ticketTempYear=createBatchTicketTemp.ticketTempYear;
        newTicket.ticketTempObservacion="ninguna";
        try {
          // VERIFICAR SI EXISTE UNA BOLETA EN ESE MES Y AÑO
          verifyMonthYear=await this.ticketTempRepository.findOne({
            where:{  
              employee:{employeeId:element},          
              ticketTempMonth:createBatchTicketTemp.ticketTempMonth,
              ticketTempYear:createBatchTicketTemp.ticketTempYear,          
            }
          })                   
        } catch (error) {       
          this.handleDBExceptions(error);
        }
        if(verifyMonthYear) throw new BadRequestException('The employee has a ticket in this Date')  
        //OBTENER EL CORRELATIVO
        const correlative= await this.correlativeRepository.findOne({
        where:{
            correlativeYear:createBatchTicketTemp.ticketTempYear,
            correlativeSerie:"t"}
        })
        if(!correlative) throw new NotFoundException(`correlative with serie: t and year:${createBatchTicketTemp.ticketTempYear} not found`)      
        const numberToString= (correlative.correlativeNumber+1).toString().padStart(5,'0');
        newTicket.ticketTempCorrelative=`${correlative.correlativeSerie}${correlative.correlativeYear}-${numberToString}`      
        const verifyTicket=await this.ticketTempRepository.findBy({ticketTempCorrelative:newTicket.ticketTempCorrelative})
        if(verifyTicket.length!=0) throw new  BadRequestException(`Key ("ticketTempCorrelative")=(${newTicket.ticketTempCorrelative}) already exists.`)
          try {          
          console.log(newTicket);
              const data=this.ticketTempRepository.create(newTicket)
              await this.ticketTempRepository.save(data);    
              await this.correlativeRepository.update({ 
                correlativeYear: createBatchTicketTemp.ticketTempYear,
                correlativeSerie:"t"},
                {
                  correlativeNumber:correlative.correlativeNumber+1
                })  
          } catch (error) {
            console.log('error')
              this.handleDBExceptions(error);
          }
        }
        return 'se agrego'; 
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
    async findByYearMonth(ticketTempYear,ticketTempMonth){
     const data=await this.ticketTempRepository.find({
          where:{ticketTempMonth:1,ticketTempYear:2024},
          relations:['employee'],
           select:{
            ticketTempCorrelative:true, 
            employee:{employeeDni:true,employeeFullname:true}           
            // employee.employeeFullname:true
           }

      })
      return data;
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
