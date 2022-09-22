import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID}  from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BudgetGoal } from '../entities';
import { CreateBudgetGoalDto } from '../dto/create-budget-goal.dto';
import { UpdateBudgetGoalDto } from '../dto/update-budget-goal-dto';
@Injectable()
export class BudgetGoalService {
    private readonly logger=new Logger('BudgetGoalService')
    constructor(
        @InjectRepository(BudgetGoal)
        private readonly budgetGoalRepository:Repository<BudgetGoal>
    ){}
     /**TODO: CREAR */
     async create(createBudgetGoalDto:CreateBudgetGoalDto){
        try {
            const budgetGoal=this.budgetGoalRepository.create(createBudgetGoalDto)
            await this.budgetGoalRepository.save(budgetGoal);
            return budgetGoal;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /**TODO: PAGINACION */
    async findAll(paginationDto:PaginationDto){
        const {page=1,size=100}=paginationDto
        const calcSkip=(page-1)*size
        const query= await this.budgetGoalRepository.findAndCount({
          take:size,
          skip:calcSkip,
          order:{
            budgetGoalDescription:1
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
      let budgetGoal:BudgetGoal
      if(isUUID(term)){
        budgetGoal=await this.budgetGoalRepository.findOneBy({budgetGoalId:term})
      }else{      
        const queryBuilder= this.budgetGoalRepository.createQueryBuilder();
        budgetGoal=await queryBuilder
          .where('"budgetGoalDescription"=:budgetGoalDescription',
            {budgetGoalDescription:term}).getOne();
      } 
      if(!budgetGoal)  throw new NotFoundException(`budgetGoal with ${term} not found`)
      return budgetGoal
    }

    /**TODO: ACTUALIZAR */
    async update(id: string, updatebudgetGoalDto: UpdateBudgetGoalDto) {      
        var budgetGoal=await this.budgetGoalRepository.preload({
            budgetGoalId:id,
          ...updatebudgetGoalDto
        });
        if(!budgetGoal) throw new NotFoundException(`budgetGoal with id: ${id} not found`)
      try {  
          await this.budgetGoalRepository.save(budgetGoal)        
          return budgetGoal       
      } catch (error) {      
        this.handleDBExceptions(error)
      }
    }
    /**TODO: BORRAR */
    async remove(id: string) {
      const budgetGoal=await this.findOne(id);
      try {
        await this.budgetGoalRepository.remove(budgetGoal)
        return {msg:'deleted budgetGoal'}
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
