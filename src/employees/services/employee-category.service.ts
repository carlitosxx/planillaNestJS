import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmployeeCategory } from '../entities';
import { CreateEmployeeCategoryDto } from '../dto/create-employee-category.dto';
import { UpdateEmployeeCategoryDto } from '../dto/update-employee-category.dto';

@Injectable()
export class EmployeeCategoryService {
    private readonly logger=new Logger('ConditionService')
    constructor(
        @InjectRepository(EmployeeCategory)
        private readonly employeeCategoryRepository:Repository<EmployeeCategory>
    ){}
     /**TODO: CREAR */
     async create(createEmployeeCategoryDto:CreateEmployeeCategoryDto){
        try {
            const employeeCategory=this.employeeCategoryRepository.create(createEmployeeCategoryDto)
            await this.employeeCategoryRepository.save(employeeCategory);
            return employeeCategory;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.employeeCategoryRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            employeeCategoryShortDescription:1
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
      let employeeCategory:EmployeeCategory
      if(isUUID(term)){
        employeeCategory=await this.employeeCategoryRepository.findOneBy({employeeCategoryId:term})
      }else{      
        const queryBuilder= this.employeeCategoryRepository.createQueryBuilder();
        employeeCategory=await queryBuilder
          .where('"employeeCategoryShortDescription"=:employeeCategoryShortDescription or"employeeCategoryDescription"=:employeeCategoryDescription',
            {employeeCategoryShortDescription:term,employeeCategoryDescription:term}).getOne();
      } 
      if(!employeeCategory)  throw new NotFoundException(`employeeCategory with ${term} not found`)
      return employeeCategory
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateEmployeeCategoryDto: UpdateEmployeeCategoryDto) {      
        var employeeCategory=await this.employeeCategoryRepository.preload({
            employeeCategoryId:id,
          ...updateEmployeeCategoryDto
        });
        if(!employeeCategory) throw new NotFoundException(`employeeCategory with id: ${id} not found`)
      try {  
          await this.employeeCategoryRepository.save(employeeCategory)        
          return employeeCategory       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const employeeCategory=await this.findOne(id);
      try {
        await this.employeeCategoryRepository.remove(employeeCategory)
        return {msg:'deleted employeeCategory'}
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
