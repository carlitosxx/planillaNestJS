import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PensionSystem, PensionAdministrator } from '../entities';
import { CreatePensionAdministratorDto } from '../dto/create-pensionAdministrator.dto';
import { UpdatePensionAdministratorDto } from '../dto/update-pensionAdministrator.dto';
@Injectable()
export class PensionAdministratorService {
    private readonly logger=new Logger('PensionAdministratorService')
    constructor(
        @InjectRepository(PensionAdministrator)
        private readonly pensionAdministratorRepository:Repository<PensionAdministrator>
    ){}
     /**TODO: CREAR */
     async create(createPensionAdministratorDto:CreatePensionAdministratorDto){
        try {            
            const pensionAdministrator=this.pensionAdministratorRepository.create(createPensionAdministratorDto)
            await this.pensionAdministratorRepository.save(pensionAdministrator);
            return pensionAdministrator;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const {pensionSystemId}=paginationDto
        const calcSkip=(page-1)*size       
        if(!pensionSystemId){
          const query= await this.pensionAdministratorRepository.findAndCount({
            take:size,
            skip:calcSkip,
            order:{
              pensionAdministratorCode:1
            },          
            relations:['pensionSystem']         
          });
          return {
            total:query[1],
            data:query[0]
          }
        }else{
          const queryBuilder= this.pensionAdministratorRepository.createQueryBuilder('pensionAdministrator');
          const query=await queryBuilder
              .leftJoinAndSelect("pensionAdministrator.pensionSystem",'B')            
            .where("B.pensionSystemId"+'=:pensionSystemId',{pensionSystemId:pensionSystemId})
            .getMany()          
            return {
              total:Object.keys(query).length,
              data:query
            }
          }   
    }

     /**TODO: BUSCAR POR: */
    async findOne(term: string) {
      let pensionAdministrator:PensionAdministrator
      if(isUUID(term)){
        pensionAdministrator=await this.pensionAdministratorRepository.findOne({where:{pensionAdministratorId:term},relations:['pensionSystem'] })
      }else{      
        const queryBuilder= this.pensionAdministratorRepository.createQueryBuilder('pensionAdministrator');
        pensionAdministrator=await queryBuilder
          .leftJoinAndSelect('pensionAdministrator.pensionSystem','pensionSystem')
          .where('"pensionAdministratorCode"=:pensionAdministratorCode or "pensionAdministratorDescription"=:pensionAdministratorDescription ',
            {pensionAdministratorCode:term,pensionAdministratorDescription:term}).getOne();
      } 
      if(!pensionAdministrator)  throw new NotFoundException(`pension Administrator with ${term} not found`)
      return pensionAdministrator
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updatePensionAdministratorDto: UpdatePensionAdministratorDto) {      
        var pensionAdministrator=await this.pensionAdministratorRepository.preload({
          pensionAdministratorId:id,
          ...updatePensionAdministratorDto
        });
        if(!pensionAdministrator) throw new NotFoundException(`Pension administrator with id: ${id} not found`)
      try {  
          await this.pensionAdministratorRepository.save(pensionAdministrator)        
          return pensionAdministrator       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const pensionAdministrator=await this.findOne(id);
      try {
        await this.pensionAdministratorRepository.remove(pensionAdministrator)
        return {msg:'deleted pensionAdministrator'}
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
