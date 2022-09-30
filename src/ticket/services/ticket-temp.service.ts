import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Concept, Correlative, TicketDetailTemp, TicketTemp } from '../entities';
import { CreateTicketTempDto, UpdateTicketTempDto } from '../dto';
import { CreateBatchTicketTemp } from '../dto/create-batch-ticket-temp.dto';
import { Employee } from 'src/employees/entities';
import { UpdateArrayOfDayWorkedDelay } from '../dto/Update-array-of-day-worked-delay.dto';

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
        @InjectRepository(Concept)
        private readonly conceptRepository:Repository<Concept>,
        private readonly dataSource: DataSource
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
      if(verifyMonthYear) throw new BadRequestException('El empleado tiene una boleta en esta fecha')
      //OBTENER EL ULTIMO NUMERO DEL CORRELATIVO
      const correlative= await this.correlativeRepository.findOne({
        where:{
            correlativeYear:createTicketTempDto.ticketTempYear,
            correlativeSerie:"t"}
        })
      if(!correlative) throw new NotFoundException(`Numero de correlativo con serie: T y año:${createTicketTempDto.ticketTempYear} no fue encontrado`)      
      const numberToString= (correlative.correlativeNumber+1).toString().padStart(5,'0');
      //ARMAR EL CORRELATIVO CON AÑO Y SERIE
      createTicketTempDto.ticketTempCorrelative=`${correlative.correlativeSerie}${correlative.correlativeYear}-${numberToString}`      
      const verifyTicket=await this.ticketTempRepository.findBy({ticketTempCorrelative:createTicketTempDto.ticketTempCorrelative})
      if(verifyTicket.length!=0) throw new  BadRequestException(
      `La llave ("ticketTempCorrelative")=(${createTicketTempDto.ticketTempCorrelative}) actualmente existe.`) 
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
        newTicket.entity=createBatchTicketTemp.entity;
        newTicket.responsible=createBatchTicketTemp.responsible;
        newTicket.ticketTempDaysWorked=30;
        newTicket.ticketTempDaysNotWorked=0;
        newTicket.ticketTempDaysSubsidized=0;
        newTicket.ticketTempDelayDays=0;
        newTicket.ticketTempDelayHours=0;
        newTicket.ticketTempDelayMinutes=0;
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

    /**TODO: ACTUALIZAR BOLETA Y AGREGAR CONCEPTOS DE REMUNERACION Y TARDANZA */
    async updateDaysWorkedDelay(updateArrayOfDayWorkedDelay:UpdateArrayOfDayWorkedDelay){  
      //BUSCAMOS EL ID DEL CONCEPTO DE TARDANZA POR EL CODIGO """1"""    
      const concepDelay= await this.conceptRepository.findOne({ where:{conceptCode:1}})
      const conceptDelayId=concepDelay.conceptId
      //BUSCAMOS EL ID DEL CONCEPTO DE REMUNERACION POR EL CODIGO """2"""
      const conceptRemuneration=await this.conceptRepository.findOne({where:{conceptCode:2}})
      const conceptRemunerationId=conceptRemuneration.conceptId;
      //CICLO FOR DEL ARREGLO DE TICKETS
      for (const element of updateArrayOfDayWorkedDelay.ticketData){
        //SE BUSCA EL EMPLEADO POR EL CORRELATIVO DE LA BOLETA TEMPORAL        
        let employee= await this.ticketTempRepository.findOne({
          where:{ticketTempCorrelative:element.ticketTempCorrelative},
          relations:['employee','employee.salary','employee.workday']          
        })
        if (!employee) throw new NotFoundException(`No se encontro este correlativo ${element.ticketTempCorrelative}`)        
        const salary=employee.employee.salary.salarySalary;
        const HoursDay=employee.employee.workday.workdayHoursDay;
        const queryRunner=this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          /**
           * VERIFICAMOS SI TRAE EL CAMPO VACACIONES Y ACTUALIZAMOS DIAS TRABAJADOS,
           * NO TRABAJADOS, SUBSIDIADOS Y VACACIONES
          **/          
          if(element.ticketTempDateStartVacation && element.ticketTempDateEndVacation){            
              const queryDaysWorked= await queryRunner.manager.update(
                TicketTemp,
              {
              ticketTempCorrelative:element.ticketTempCorrelative
              },
              {
              ticketTempDaysWorked:element.ticketTempDaysWorked,
              ticketTempDaysNotWorked:element.ticketTempDaysNotWorked,
              ticketTempDaysSubsidized:element.ticketTempDaysSubsidized,
              ticketTempDateStartVacation:element.ticketTempDateStartVacation,
              ticketTempDateEndVacation:element.ticketTempDateEndVacation,
              ticketTempDelayDays:element.delayDays,
              ticketTempDelayHours:element.delayHours,
              ticketTempDelayMinutes:element.delayMinutes
              })   
          }else{            
              const queryDaysWorked= await queryRunner.manager.update(
                TicketTemp,
                {
                ticketTempCorrelative:element.ticketTempCorrelative
                },
                {
                ticketTempDaysWorked:element.ticketTempDaysWorked,
                ticketTempDaysNotWorked:element.ticketTempDaysNotWorked,
                ticketTempDaysSubsidized:element.ticketTempDaysSubsidized,
                ticketTempDelayDays:element.delayDays,
                ticketTempDelayHours:element.delayHours,
                ticketTempDelayMinutes:element.delayMinutes 
                }) 
          }
          //SE CALCULA LA REMUNERACION BASICA Y SE AGREGA EL CONCEPTO 
          const amountRemuneration=(salary-(salary/30)*element.ticketTempDaysNotWorked)
          const queryRemuneration= this.ticketDetailTempRepository.create({
            ticketTempCorrelative:element.ticketTempCorrelative,
            conceptId:conceptRemunerationId,
            ticketDetailTempAmount:amountRemuneration
          })
          //SE CALCULA LA TARDANZA Y SE AGREGA EL CONCEPTO              
          const amountDelayDays=(salary/30)*element.delayDays
          const amountDelayHours=((salary/30)/HoursDay)*element.delayHours
          const amountDelayMinutes=(((salary/30)/HoursDay)/60)*element.delayMinutes
          const totalAmountDelay=amountDelayDays+amountDelayHours+amountDelayMinutes
          const queryDelay=  this.ticketDetailTempRepository.create({
            ticketTempCorrelative:element.ticketTempCorrelative,
            conceptId:conceptDelayId,
            ticketDetailTempAmount:totalAmountDelay
          })
          /**
           * GUARDAMOS LOS 3 CAMBIOS(ACTUALIZACION DEL TICKET Y LA AGREGACION DE LOS 2 
           * CONCEPTOS AL DETALLE DE BOLETA) SI FALLA APLICAMOS ROLLBACK
          **/            
          await queryRunner.manager.save(queryRemuneration);
          await queryRunner.manager.save(queryDelay);
          await queryRunner.commitTransaction();          
        } catch (error) {     
          await queryRunner.rollbackTransaction()     
          this.handleDBExceptions(error);
        } finally {          
          await queryRunner.release()
        }
      }      
      return {msg:'Se importaron todos los correlativos satisfactoriamente'}
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.ticketTempRepository.findAndCount({
          take:size,
          skip:calcSkip,
          relations:[
            'entity','entity.financing','entity.budgetGoal','responsible','employee','employee.typeEmployee',
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
    /**TODO: BUSCAR POR AÑO Y MES */
    async findByYearMonth(ticketTempYear:number,ticketTempMonth:number){     
     const data=await this.ticketTempRepository.find({
          where:{ticketTempMonth:ticketTempMonth,ticketTempYear:ticketTempYear},
          relations:['employee'],
           select:{
            ticketTempCorrelative:true, 
            employee:{employeeDni:true,employeeFullname:true}            
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
       //BUSCAMOS EL ID DEL CONCEPTO DE TARDANZA POR EL CODIGO """1"""    
       const concepDelay= await this.conceptRepository.findOne({ where:{conceptCode:1}})
       const conceptDelayId=concepDelay.conceptId
       //BUSCAMOS EL ID DEL CONCEPTO DE REMUNERACION POR EL CODIGO """2"""
       const conceptRemuneration=await this.conceptRepository.findOne({where:{conceptCode:2}})
       const conceptRemunerationId=conceptRemuneration.conceptId;

      const {ticketTempDelayDays,ticketTempDelayHours,ticketTempDelayMinutes}=updateTicketTempDto
      var data=await this.ticketTempRepository.preload({
            ticketTempCorrelative:id,
          ...updateTicketTempDto
      });
      if(!data) throw new NotFoundException(`La busqueda con el correlativo: ${id} no ah sido encontrada`)
      let employee= await this.ticketTempRepository.findOne({
        where:{ticketTempCorrelative:id},
        relations:['employee','employee.salary','employee.workday']          
      })
      const salary=employee.employee.salary.salarySalary;
      const HoursDay=employee.employee.workday.workdayHoursDay;
      const amountDelayDays=(salary/30)*ticketTempDelayDays
          const amountDelayHours=((salary/30)/HoursDay)*ticketTempDelayHours
          const amountDelayMinutes=(((salary/30)/HoursDay)/60)*ticketTempDelayMinutes
          const totalAmountDelay=amountDelayDays+amountDelayHours+amountDelayMinutes
      const conceptDelay=await this.ticketDetailTempRepository.findOne({
        where:{
          ticketTempCorrelative:id,
          conceptId:conceptDelayId
        }
      })
      if (conceptDelay){
        //CALCULAMOS LA TARDANZA
        salary
        //ACTUALIZAMOS
        await this.ticketDetailTempRepository.update({
          ticketTempCorrelative:id,
          conceptId:conceptDelayId      
        },{
          ticketDetailTempAmount:totalAmountDelay,
        })
      }else{
        //creamos
      }
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
