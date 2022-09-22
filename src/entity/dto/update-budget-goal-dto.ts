import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetGoalDto } from './create-budget-goal.dto';

export class UpdateBudgetGoalDto extends PartialType(CreateBudgetGoalDto) {}
