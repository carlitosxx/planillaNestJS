import { Module } from '@nestjs/common';
import { EntityService } from './services/entity.service';
import { EntityController } from './controllers/entity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entitie,BudgetGoal,Financing,Responsible } from './entities';
import { BudgetGoalService } from './services/budget-goal.service';
import { FinancingService } from './services/financing.service';
import { ResponsibleService } from './services/responsible.service';
import { BudgetGoalController } from './controllers/budget-goal.controller';
import { FinancingController } from './controllers/financing.controller';
import { ResponsibleController } from './controllers/responsible.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EntityController, BudgetGoalController, FinancingController, ResponsibleController],
  providers: [EntityService, BudgetGoalService, FinancingService, ResponsibleService],
  imports:[AuthModule,
    TypeOrmModule.forFeature([Entitie,BudgetGoal,Financing,Responsible])]
})
export class EntityModule {}
