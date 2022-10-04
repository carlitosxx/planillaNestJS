import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PensionSystem } from '../entities/pensionSystem.entity';
import { CreatePensionSystemDto } from '../dto/create-pension-system.dto';
import { UpdatePensionSystemDto } from '../dto/update-pension-system.dto';
@Injectable()
export class PensionSystemService {
    private readonly logger=new Logger('PensionSystemService')
    constructor(
        @InjectRepository(PensionSystem)
        private readonly pensionSystemRepository:Repository<PensionSystem>
    ){}

    /**TODO: CREAR */
    async create(createPensionSystemDto:CreatePensionSystemDto){
        try {
            const pensionSystem=this.pensionSystemRepository.create(createPensionSystemDto)
            await this.pensionSystemRepository.save(pensionSystem);
            return pensionSystem;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.pensionSystemRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            pensionSystemCode:1
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
      let pensionSystem:PensionSystem
      if(isUUID(term)){
        pensionSystem=await this.pensionSystemRepository.findOneBy({pensionSystemId:term})
      }else{      
        const queryBuilder= this.pensionSystemRepository.createQueryBuilder();
        pensionSystem=await queryBuilder
          .where('"pensionSystemCode"=:pensionSystemCode or "pensionSystemDescription"=:pensionSystemDescription',
            {pensionSystemCode:term,pensionSystemDescription:term}).getOne();
      } 
      if(!pensionSystem)  throw new NotFoundException(`Pension System with ${term} not found`)
      return pensionSystem
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updatePensionSystemDto: UpdatePensionSystemDto) {      
        var pensionSystem=await this.pensionSystemRepository.preload({
            pensionSystemId:id,
          ...updatePensionSystemDto
        });
        if(!pensionSystem) throw new NotFoundException(`Pension System with id: ${id} not found`)
      try {  
          await this.pensionSystemRepository.save(pensionSystem)        
          return pensionSystem       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const pensionSystem=await this.findOne(id);
      try {
        await this.pensionSystemRepository.remove(pensionSystem)
        return {msg:'deleted Pension system'}
      } catch (error) {        
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR TODO */
    async removeAll(){
     try {
       await this.pensionSystemRepository.createQueryBuilder().delete().execute()        
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
