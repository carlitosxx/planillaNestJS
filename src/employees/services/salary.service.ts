import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmployeeCategory, Salary } from '../entities';
import { CreateSalaryDto } from '../dto/create-salary.dto';
import { UpdateSalaryDto } from '../dto/update-salary.dto';
@Injectable()
export class SalaryService {
    private readonly logger=new Logger('SalaryService')
    constructor(
        @InjectRepository(Salary)
        private readonly salaryRepository:Repository<Salary>
    ){}
     /**TODO: CREAR */
     async create(createSalaryDto:CreateSalaryDto){
        try {            
            const salary=this.salaryRepository.create(createSalaryDto)
            await this.salaryRepository.save(salary);
            return salary;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const {employeeCategoryId}=paginationDto
        const calcSkip=(page-1)*size       
        if(!employeeCategoryId){
          const query= await this.salaryRepository.findAndCount({
            take:size,
            skip:calcSkip,
            order:{
              salaryYear:1
            },          
            relations:['employeeCategory']         
          });
          return {
            total:query[1],
            data:query[0]
          }
        }else{
          const queryBuilder= this.salaryRepository.createQueryBuilder('salary');
          const query=await queryBuilder
              .leftJoinAndSelect("salary.employeeCategory",'B')
            // .leftJoinAndSelect("EmployeeCategory", "b", "b.employeeCategoryId = A.employeeCategoryId")
            .where("B.employeeCategoryId"+'=:employeeCategoryId',{employeeCategoryId:employeeCategoryId})
            .getMany()          
            return {
              total:Object.keys(query).length,
              data:query
            }
          }   
    }

     /**TODO: BUSCAR POR: */
    async findOne(term: string) {
      let salary:Salary
      if(isUUID(term)){
        salary=await this.salaryRepository.findOne({where:{salaryId:term},relations:['employeeCategory'] })
      }else{      
        const queryBuilder= this.salaryRepository.createQueryBuilder('salary');
        salary=await queryBuilder
          .leftJoinAndSelect('salary.employeeCategory','employeeCategory')
          .where('"salarySalary"=:salarySalary or "salaryYear"=:salaryYear ',
            {salarySalary:term,salaryYear:term}).getOne();
      } 
      if(!salary)  throw new NotFoundException(`salary with ${term} not found`)
      return salary
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateSalaryDto: UpdateSalaryDto) {      
        var salary=await this.salaryRepository.preload({
          salaryId:id,
          ...updateSalaryDto
        });
        if(!salary) throw new NotFoundException(`salary with id: ${id} not found`)
      try {  
          await this.salaryRepository.save(salary)        
          return salary       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const salary=await this.findOne(id);
      try {
        await this.salaryRepository.remove(salary)
        return {msg:'deleted salary'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }

    /**TODO: BORRAR TODO */
    async removeAll(){
      try {
        await this.salaryRepository.createQueryBuilder().delete().execute()        
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
