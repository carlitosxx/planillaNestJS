import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Position } from '../entities';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Injectable()
export class PositionService {
    private readonly logger=new Logger('PositionService')
    constructor(
        @InjectRepository(Position)
        private readonly positionRepository:Repository<Position>
    ){}
     /**TODO: CREAR */
     async create(createPositionDto:CreatePositionDto){
        try {
            const position=this.positionRepository.create(createPositionDto)
            await this.positionRepository.save(position);
            return position;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.positionRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            positionCode:1
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
      let position:Position
      if(isUUID(term)){
        position=await this.positionRepository.findOneBy({positionId:term})
      }else{      
        const queryBuilder= this.positionRepository.createQueryBuilder();
        position=await queryBuilder
          .where('"positionCode"=:positionCode or "positionName"=:positionName or"positionDescription"=:positionDescription',
            {positionCode:term,positionName:term,positionDescription:term}).getOne();
      } 
      if(!position)  throw new NotFoundException(`Position with ${term} not found`)
      return position
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updatePositionDto: UpdatePositionDto) {      
        var position=await this.positionRepository.preload({
            positionId:id,
          ...updatePositionDto
        });
        if(!position) throw new NotFoundException(`position with id: ${id} not found`)
      try {  
          await this.positionRepository.save(position)        
          return position       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const position=await this.findOne(id);
      try {
        await this.positionRepository.remove(position)
        return {msg:'deleted position'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR TODO */
    async removeAll(){
     try {
       await this.positionRepository.createQueryBuilder().delete().execute()        
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
