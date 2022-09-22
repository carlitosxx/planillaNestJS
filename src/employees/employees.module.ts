import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { TypeEmployeeController } from './controllers/type-employee.controller';
import { Employee,TypeEmployee,OrganicUnit,Condition,LaborRegime,OccupationalGroup,
  Establishment,Position,Workday, EmployeeCategory, Salary, PensionSystem, PensionAdministrator } from './entities';
import { TypeEmployeeService } from './services/type-employee.service';
import { OrganicUnitController } from './controllers/organic-unit.controller';
import { OrganicUnitService } from './services/organic-unit.service';
import { ConditionService } from './services/condition.service';
import { ConditionController } from './controllers/condition.controller';
import { LaborRegimeService } from './services/labor-regime.service';
import { OccupationalGroupService } from './services/occupational-group.service';
import { EstablishmentService } from './services/establishment.service';
import { PositionService } from './services/position.service';
import { WorkdayService } from './services/workday.service';
import { LaborRegimeController } from './controllers/labor-regime.controller';
import { OccupationalGroupController } from './controllers/occupational-group.controller';
import { EstablishmentController } from './controllers/establishment.controller';
import { PositionController } from './controllers/position.controller';
import { WorkdayController } from './controllers/workday.controller';
import { EmployeeCategoryService } from './services/employee-category.service';
import { EmployeeCategoryController } from './controllers/employee-category.controller';
import { SalaryController } from './controllers/salary.controller';
import { SalaryService } from './services/salary.service';
import { PensionSystemController } from './controllers/pension-system.controller';
import { PensionSystemService } from './services/pension-system.service';
import { PensionAdministratorController } from './controllers/pension-administrator.controller';
import { PensionAdministratorService } from './services/pension-administrator.service';
import { AuthModule } from 'src/auth/auth.module';
// import {PassportModule}
@Module({
  controllers: [EmployeesController, TypeEmployeeController, OrganicUnitController,
    ConditionController, LaborRegimeController, OccupationalGroupController,
    EstablishmentController, PositionController, WorkdayController, EmployeeCategoryController,
    SalaryController,
    PensionSystemController,
    PensionAdministratorController],
  providers: [EmployeesService, TypeEmployeeService, OrganicUnitService,
    ConditionService, LaborRegimeService, OccupationalGroupService,
    EstablishmentService, PositionService, WorkdayService, EmployeeCategoryService,
    SalaryService,
    PensionSystemService,
    PensionAdministratorService],
  imports:[   
    AuthModule,    
    TypeOrmModule.forFeature([
      Employee, TypeEmployee, OrganicUnit, Condition, LaborRegime, OccupationalGroup,
      Establishment, Position, Workday, EmployeeCategory, Salary, PensionSystem,
      PensionAdministrator
    ])
  ]
})
export class EmployeesModule {}
