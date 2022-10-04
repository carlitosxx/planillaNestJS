import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Workday } from '../entities';
import { CreateWorkdayDto } from '../dto/create-workday.dto';
import { UpdateWorkdayDto } from '../dto/update-workday.dto';

@Injectable()
export class WorkdayService {
    private readonly logger=new Logger('WorkdayService')
    constructor(
        @InjectRepository(Workday)
        private readonly workdayRepository:Repository<Workday>
    ){}
     /**TODO: CREAR */
     async create(createWorkdayDto:CreateWorkdayDto){
        try {
            const workday=this.workdayRepository.create(createWorkdayDto)
            await this.workdayRepository.save(workday);
            return workday;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.workdayRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            workdayDescription:1
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
      let workday:Workday
      if(isUUID(term)){
        workday=await this.workdayRepository.findOneBy({workdayId:term})
      }else{      
        const queryBuilder= this.workdayRepository.createQueryBuilder();
        workday=await queryBuilder
          .where('"workdayHoursDay"=:workdayHoursDay or "workdayDaysWeek"=:workdayDaysWeek or"workdayDescription"=:workdayDescription',
            {workdayHoursDay:term,workdayDaysWeek:term,workdayDescription:term}).getOne();
      } 
      if(!workday)  throw new NotFoundException(`workday with ${term} not found`)
      return workday
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateWorkdayDto: UpdateWorkdayDto) {      
        var workday=await this.workdayRepository.preload({
            workdayId:id,
          ...updateWorkdayDto
        });
        if(!workday) throw new NotFoundException(`workday with id: ${id} not found`)
      try {  
          await this.workdayRepository.save(workday)        
          return workday       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const workday=await this.findOne(id);
      try {
        await this.workdayRepository.remove(workday)
        return {msg:'deleted workday'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }
   /**TODO: BORRAR TODO */
   async removeAll(){
    try {
      await this.workdayRepository.createQueryBuilder().delete().execute()        
      return {msg:'Borrar todo'}
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
