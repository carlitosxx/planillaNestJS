import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import {Entitie} from '../entities/entity.entity'
import {validate as isUUID}  from 'uuid'
import { CreateEntityDto } from '../dto/create-entity.dto';
import { UpdateEntityDto } from '../dto/update-entity.dto';
import {join} from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const unlinkAsync=promisify(fs.unlink)

@Injectable()
export class EntityService {
  private readonly logger=new Logger('EntityService')
  constructor(
    @InjectRepository(Entitie)
    private readonly entityRepository:Repository<Entitie> 
  ){}
   /**TODO: CREAR */
   async create(createEntityDto,file){    
        createEntityDto.entityLogo=file.filename
        if(createEntityDto.entityStatus==="1"){
          const directory=join(__dirname,'../../..','static/images',file.filename)        
          await unlinkAsync(directory);
          throw new BadRequestException('change you entityStatus to 0')
        } 
    try {   
        const entity=this.entityRepository.create(createEntityDto)
        await this.entityRepository.save(entity);
        return entity;
    } catch (error) {
        const directory=join(__dirname,'../../..','static/images',file.filename)        
        await unlinkAsync(directory);
        this.handleDBExceptions(error);
    }
}

/**TODO: PAGINACION */
async findAll(paginationDto:PaginationDto){
    const {page=1,size=100}=paginationDto
    const calcSkip=(page-1)*size
    const query= await this.entityRepository.findAndCount({
      take:size,
      skip:calcSkip,
      relations:['financing','budgetGoal'],
      order:{
        entityRuc:1
      }         
    }
    )
    const remap =  query[0].map((element)=>{
      element.entityLogo='/files/'+element.entityLogo
    })   
    return {
      total:query[1],
      data:query[0]
    }
}

 /**TODO: BUSCAR POR: */
async findOne(term: string) {
  let entity:Entitie
  if(isUUID(term)){
    entity=await this.entityRepository.findOne({where:{entityId:term},relations:['financing','budgetGoal']})
  }else{      
    const queryBuilder= this.entityRepository.createQueryBuilder('entity');
    entity=await queryBuilder
    .leftJoinAndSelect('entity.financing','financing')
    .leftJoinAndSelect('entity.budgetGoal','budgetGoal')
    .where('"entityCode"=:entityCode or "entityName"=:entityName or"entityEmployer"=:entityEmployer or "entityRuc"=:entityRuc',
        {entityCode:term,entityName:term,entityEmployer:term,entityRuc:term}).getOne();
  } 
  if(!entity)  throw new NotFoundException(`Entity with ${term} not found`)
  entity.entityLogo='/files/'+entity.entityLogo   
  return entity
}

/**TODO: ACTUALIZAR */
async update(id: string, updateEntityDto: UpdateEntityDto,file:Express.Multer.File) { 
  updateEntityDto.entityLogo=file.filename   
    var entity=await this.entityRepository.preload({
      entityId:id,
      ...updateEntityDto
    });
    if(!entity) 
    {
      // BORRAR EL ARCHIVO RECIBIDO PQ NO ENCONTRO EL ID
      const directory=join(__dirname,'../../..','static/images',file.filename)        
      await unlinkAsync(directory);
      throw new NotFoundException(`Entity with id: ${id} not found`)
    }
  try {  
      await this.entityRepository.save(entity)
      //SI ACTUALIZA LA FOTO NO BORRA LA ANTERIOR        
      return entity       
  } catch (error) {
    const directory=join(__dirname,'../../..','static/images',file.filename)        
    await unlinkAsync(directory);      
    this.handleDBExceptions(error)
  }
}
/**TODO: BORRAR */
async remove(id: string) {
  const entity=await this.findOne(id);
  try {
    await this.entityRepository.remove(entity)

    return {msg:'deleted entity'}
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
