import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { BudgetGoalService } from '../services/budget-goal.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateBudgetGoalDto } from '../dto/create-budget-goal.dto';
import { UpdateBudgetGoalDto } from '../dto/update-budget-goal-dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Authorization } from 'src/auth/decorators';
@Controller('budget-goal')
export class BudgetGoalController {
    constructor(private readonly budgetGoalService: BudgetGoalService) {}
    @Post()
    @Authorization(ValidRoles.user)
    create(@Body() createBudgetGoalDto:CreateBudgetGoalDto){
        return this.budgetGoalService.create(createBudgetGoalDto);
    }
    @Get()
    @Authorization(ValidRoles.user)
    findAll(@Query() paginationDto:PaginationDto){
        return this.budgetGoalService.findAll(paginationDto);
    }
    @Get(':term')
    @Authorization(ValidRoles.user)
    findOne(@Param('term') term: string) {
    return this.budgetGoalService.findOne(term);
    }
    @Put(':id')
    @Authorization(ValidRoles.user)
    update(
      @Param('id',ParseUUIDPipe) id: string,
      @Body() updateBudgetGoalDto: UpdateBudgetGoalDto) {
      return this.budgetGoalService.update(id, updateBudgetGoalDto);
    }
    @Delete(':id')
    @Authorization(ValidRoles.admin)
    remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.budgetGoalService.remove(id);
    }
}
