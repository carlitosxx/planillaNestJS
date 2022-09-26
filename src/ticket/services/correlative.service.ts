import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Correlative } from '../entities';
import { CreateCorrelativeDto, UpdateCorrelativeDto } from '../dto';
import { CorrelativeParamDto } from '../dto/correlative-param.dto';

@Injectable()
export class CorrelativeService {
    private readonly logger=new Logger('CorrelativeService')
    constructor(
        @InjectRepository(Correlative)
        private readonly correlativeRepository:Repository<Correlative>
    ){}
     /**TODO: CREAR */
    async create(createCorrelativeDto:CreateCorrelativeDto){
        try {
            createCorrelativeDto.correlativeSerie=createCorrelativeDto.correlativeSerie.toLowerCase()
            const data=this.correlativeRepository.create(createCorrelativeDto)
            await this.correlativeRepository.save(data);
            return data;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    /**TODO: BUSCAR POR: AÑO Y SERIE */
    async findOne(correlativeParamDto: CorrelativeParamDto) {       
        const {correlativeYear,correlativeSerie}=correlativeParamDto
        if(!correlativeYear && !correlativeSerie){
            throw new BadRequestException('Year and serie params is required')
        }
        const data=await this.correlativeRepository.findOne({
            where:{
                correlativeYear:correlativeYear,
                correlativeSerie:correlativeSerie.toLowerCase()}
            })
        if (!data) throw new NotFoundException('The correlative was not found')    
        console.log(data)
        return data       
      }
    /**TODO: ACTUALIZAR */
    async update(correlativeSerie:string,correlativeYear:number, updateCorrelativeDto: UpdateCorrelativeDto) {      
        console.log(correlativeSerie);
        console.log(correlativeYear);
        const data=await this.correlativeRepository.findOne({
            where:{
                correlativeYear:correlativeYear,
                correlativeSerie:correlativeSerie}
            })     
        if(!data) throw new NotFoundException(`data with correlativeSerie: ${correlativeSerie} and correlativeYear: ${correlativeYear} not found`)
        try {  
            await this.correlativeRepository.update({ 
            correlativeYear: correlativeYear,
            correlativeSerie:correlativeSerie},
            updateCorrelativeDto)              
          return {correlativeSerie,correlativeYear,...updateCorrelativeDto};       
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
