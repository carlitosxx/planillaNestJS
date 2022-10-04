import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OccupationalGroup } from '../entities';
import { CreateOccupationalGroupDto } from '../dto/create-occupational-group.dto';
import { UpdateOccupationalGroupDto } from '../dto/update-occupational-group.dto';

@Injectable()
export class OccupationalGroupService {
    private readonly logger=new Logger('ConditionService')
    constructor(
        @InjectRepository(OccupationalGroup)
        private readonly occupationalGroupRepository:Repository<OccupationalGroup>
    ){}
     /**TODO: CREAR */
     async create(createConditionDto:CreateOccupationalGroupDto){
        try {
            const occupationalGroup=this.occupationalGroupRepository.create(createConditionDto)
            await this.occupationalGroupRepository.save(occupationalGroup);
            return occupationalGroup;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.occupationalGroupRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            occupationalGroupCode:1
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
      let occupationalGroup:OccupationalGroup
      if(isUUID(term)){
        occupationalGroup=await this.occupationalGroupRepository.findOneBy({occupationalGroupId:term})
      }else{      
        const queryBuilder= this.occupationalGroupRepository.createQueryBuilder();
        occupationalGroup=await queryBuilder
          .where('"occupationalGroupCode"=:occupationalGroupCode or "occupationalGroupName"=:occupationalGroupName or"occupationalGroupDescription"=:occupationalGroupDescription',
            {occupationalGroupCode:term,occupationalGroupName:term,occupationalGroupDescription:term}).getOne();
      } 
      if(!occupationalGroup)  throw new NotFoundException(`OccupationalGroup with ${term} not found`)
      return occupationalGroup
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updateOccupationalGroupDto: UpdateOccupationalGroupDto) {      
        var occupationalGroup=await this.occupationalGroupRepository.preload({
          occupationalGroupId:id,
          ...updateOccupationalGroupDto
        });
        if(!occupationalGroup) throw new NotFoundException(`OccupationalGroup with id: ${id} not found`)
      try {  
          await this.occupationalGroupRepository.save(occupationalGroup)        
          return occupationalGroup       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const occupationalGroup=await this.findOne(id);
      try {
        await this.occupationalGroupRepository.remove(occupationalGroup)
        return {msg:'deleted occupationalGroup'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }
     /**TODO: BORRAR TODO */
     async removeAll(){
      try {
        await this.occupationalGroupRepository.createQueryBuilder().delete().execute()        
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
