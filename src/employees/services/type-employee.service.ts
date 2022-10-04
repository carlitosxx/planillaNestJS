import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid'
import { TypeEmployee } from '../entities/typeEmployee.entity';
import { CreateTypeEmployeeDto } from '../dto/create-type-employee.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateTypeEmployeeDto } from '../dto/update-type-employee.dto';

@Injectable()
export class TypeEmployeeService {
    private readonly logger=new Logger('TypeEmployeeService')
    constructor(
        @InjectRepository(TypeEmployee)
        private readonly typeEmployeeRepository:Repository<TypeEmployee>
    ){}
    /**TODO: CREAR */
    async create(createTypeEmployeeDto:CreateTypeEmployeeDto){
        try {
            const typeEmployee=this.typeEmployeeRepository.create(createTypeEmployeeDto)
            await this.typeEmployeeRepository.save(typeEmployee);
            return typeEmployee;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto;
        const calcSkip=(page-1)*size;
        const query= await this.typeEmployeeRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            typeEmployeeDescription:1
          }});    
        return {
          total:query[1],
          data:query[0]
        }
    }
     /**TODO: BUSCAR POR: */
     async findOne(term: string) {
      let typeEmployee:TypeEmployee
      if(isUUID(term)){
        typeEmployee=await this.typeEmployeeRepository.findOneBy({typeEmployeeId:term})
      }else{      
        const queryBuilder= this.typeEmployeeRepository.createQueryBuilder();
        typeEmployee=await queryBuilder
          .where('"typeEmployeeDescription"=:typeEmployeeDescription',
            {typeEmployeeDescription:term}).getOne();
      } 
      if(!typeEmployee)  throw new NotFoundException(`Type employee with ${term} not found`)
      return typeEmployee
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateTypeEmployeeDto: UpdateTypeEmployeeDto) {      
        var typeEmployee=await this.typeEmployeeRepository.preload({
          typeEmployeeId:id,
          ...updateTypeEmployeeDto
        });
        if(!typeEmployee) throw new NotFoundException(`Type employee with id: ${id} not found`)
      try {  
          await this.typeEmployeeRepository.save(typeEmployee)        
          return typeEmployee       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }

    /**TODO: BORRAR */
    async remove(id: string) {
      const typeEmployee=await this.findOne(id);
      try {
        await this.typeEmployeeRepository.remove(typeEmployee)
        return {msg:'deleted type employee'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }    
    }

 /**TODO: BORRAR TODO */
    async removeAll(){
      try {
        await this.typeEmployeeRepository.createQueryBuilder().delete().execute()        
        return {msg:'Borrar todo'}
      } catch (error) {
        this.handleDBExceptions(error)
      }
    }

    /**TODO: ATRAPAR ERRORES DE BD */
    private handleDBExceptions(error:any){    
        if(error.code==='23505')
          throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs')
      }
}
