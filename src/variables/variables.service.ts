import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Variable } from './entities/variable.entity';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';

@Injectable()
export class VariablesService {

  private readonly logger=new Logger('VariablesService')
  constructor(
    @InjectRepository(Variable)
    private readonly variableRepository:Repository<Variable>
  ){}

  /**TODO: CREAR */
  async create(createVariableDto:CreateVariableDto){
    try {
        const query=this.variableRepository.create(createVariableDto)
        await this.variableRepository.save(query);
        return query;
    } catch (error) {
        this.handleDBExceptions(error);
    }
  }

  /**TODO: PAGINACION */
  async findAll(paginationDto:PaginationDto){
   const {page=1,size=100}=paginationDto
   const calcSkip=(page-1)*size
   const query= await this.variableRepository.findAndCount({
     take:size,
     skip:calcSkip,
     order:{
       variableDescription:1
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
    let variable:Variable
    if(isUUID(term)){
      variable=await this.variableRepository.findOneBy({variableId:term})
    }else{      
      const queryBuilder= this.variableRepository.createQueryBuilder();
      variable=await queryBuilder
        .where('"variableDescription"=:variableDescription',
          {variableDescription:term}).getOne();
    } 
    if(!variable)  throw new NotFoundException(`variable con ${term} no encontrado`)
    return variable
  }

  /**TODO: ACTUALIZAR */
  async update(id: string, updateVariableDto: UpdateVariableDto) {      
  var variable=await this.variableRepository.preload({
      variableId:id,
    ...updateVariableDto
  });
  if(!variable) throw new NotFoundException(`variable with id: ${id} not found`)
  try {  
      await this.variableRepository.save(variable)        
      return variable       
  } catch (error) {      
    this.handleDBExceptions(error)
  }
  }

  /**TODO: BORRAR */
  async remove(id: string) {
    const variable=await this.findOne(id);
    try {
      await this.variableRepository.remove(variable)
      return {msg:'deleted variable'}
    } catch (error) {        
      this.handleDBExceptions(error)
    }
  }

   /**TODO: BORRAR TODO */
   async removeAll(){
    try {
      await this.variableRepository.createQueryBuilder().delete().execute()        
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
