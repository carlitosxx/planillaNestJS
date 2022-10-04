import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateEmployeeCategoryDto } from 'src/employees/dto/create-employee-category.dto';
import { CreatePensionAdministratorDto } from 'src/employees/dto/create-pensionAdministrator.dto';
import { CreateSalaryDto } from 'src/employees/dto/create-salary.dto';
import { EmployeeCategory, PensionSystem } from 'src/employees/entities';
import { ConditionService } from 'src/employees/services/condition.service';
import { EmployeeCategoryService } from 'src/employees/services/employee-category.service';
import { EmployeesService } from 'src/employees/services/employees.service';
import { EstablishmentService } from 'src/employees/services/establishment.service';
import { LaborRegimeService } from 'src/employees/services/labor-regime.service';
import { OccupationalGroupService } from 'src/employees/services/occupational-group.service';
import { OrganicUnitService } from 'src/employees/services/organic-unit.service';
import { PensionAdministratorService } from 'src/employees/services/pension-administrator.service';
import { PensionSystemService } from 'src/employees/services/pension-system.service';
import { PositionService } from 'src/employees/services/position.service';
import { SalaryService } from 'src/employees/services/salary.service';
import { TypeEmployeeService } from 'src/employees/services/type-employee.service';
import { WorkdayService } from 'src/employees/services/workday.service';
import { conditionData } from './data/condition';
import { employeeCategoryData } from './data/employeeCategory';
import { establishmentData } from './data/establishment';
import { laborRegimeData } from './data/laborRegime';
import { occupationalGroupData } from './data/occupationalGroup';
import { organicUnitData } from './data/organicUnit';
import { pensionAdministratorData } from './data/pensionAdministrator';
import { pensionSystemData } from './data/pensionSystem';
import { positionData } from './data/position';
import { salaryData } from './data/salary';
import { typeEmployeeData } from './data/typeEmployee';
import { workDayData } from './data/workDay';
import { faker } from '@faker-js/faker';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';
import { FinancingService } from 'src/entity/services/financing.service';
import { financingData } from './data/financing';
import { BudgetGoalService } from 'src/entity/services/budget-goal.service';
import { budgetGoalData } from './data/budgetGoal';
import { EntityService } from 'src/entity/services/entity.service';
import { CreateEntityDto } from 'src/entity/dto/create-entity.dto';
import { CreateResponsibleDto } from 'src/entity/dto/create-responsible.dto';
import { ResponsibleService } from 'src/entity/services/responsible.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { Correlative, TypeConcept } from 'src/ticket/entities';
import { TypeConceptService } from 'src/ticket/services/type-concept.service';
import { typeConceptData } from './data/typeConcept';
import { CreateConceptDto, CreateCorrelativeDto } from 'src/ticket/dto';
import { ConceptService } from 'src/ticket/services/concept.service';
import { CorrelativeService } from 'src/ticket/services/correlative.service';
import { correlativeData } from './data/correlative';


@Injectable()
export class SeedService {
 
constructor( 
  //EMPLEADO 
  private readonly organicUnitService:OrganicUnitService,
  private readonly typeEmployeeService:TypeEmployeeService,
  private readonly conditionService:ConditionService,
  private readonly laborRegimeService:LaborRegimeService,
  private readonly occupationalGroupService:OccupationalGroupService,
  private readonly establishmentService:EstablishmentService,
  private readonly positionService:PositionService,
  private readonly workDayService:WorkdayService,
  private readonly employeCategoryService:EmployeeCategoryService,
  private readonly salaryService:SalaryService,
  private readonly pensionSystemService:PensionSystemService,
  private readonly pensionAdministratorService:PensionAdministratorService,
  private readonly employeeService:EmployeesService,
  //ENTIDAD
  private readonly financingService:FinancingService,
  private readonly budgetGoalService:BudgetGoalService,
  private readonly entityService:EntityService,
  //RESPONSABLE
  private readonly responsibleService:ResponsibleService,
  //AUTENTICACION
  private readonly authService:AuthService,
  //TICKET
  private readonly typeConceptService:TypeConceptService,
  private readonly conceptService:ConceptService,
  private readonly correlativeService:CorrelativeService
){}
  //TODO: SEED
  async executeSeed() {
    const organicUnit= await this.organicUnit()
    if(!organicUnit) throw new BadRequestException('Fallo el seed de Unidad organica')
    const typeEmployee=await this.typeEmployee()
    if(!typeEmployee) throw new BadRequestException('Fallo el seed de Tipo de empleado')
    const condition=await this.condition()
    if(!condition) throw new BadRequestException('Fallo el seed de Condicion')
    const laborRegime=await this.laborRegimen()
    if(!laborRegime) throw new BadRequestException('Fallo el seed de Regimen laboral')
    const occupationalGroup=await this.occupationalGroup()
    if(!occupationalGroup) throw new BadRequestException('Fallo el seed de Grupo ocupacional')
    const establishment=await this.establishment()
    if(!establishment) throw new BadRequestException('Fallo el seed de Establecimiento')
    const position=await this.position()
    if(!position) throw new BadRequestException('Fallo el seed de Position')
    const workDay=await this.workDay()
    if(!workDay) throw new BadRequestException('Fallo el seed de Dias de trabajo')
    const employeeCategory=await this.employeeCategory()    
    if(!employeeCategory) throw new BadRequestException('Fallo el seed de Categoria de empleado')
    const salary=await this.salary();
    if(!salary) throw new BadRequestException('Fallo el seed de Salario')
    const pensionSystem=await this.pensionSystem();
    if(!pensionSystem) throw new BadRequestException('Fallo el seed de Sistema de pension')
    const pensionAdministrator=await this.pensionAdministrator();
    if(!pensionAdministrator) throw new BadRequestException('Fallo el seed del Administrador de pension') 
    const employee=await this.employee();
    if(!employee) throw new BadRequestException('Fallo el seed del Empleado')
    const financing=await this.financing();
    if(!financing) throw new BadRequestException('Fallo el seed de Financiamiento')
    const budgetGoal=await this.budgetGoal();
    if(!budgetGoal) throw new BadRequestException('Fallo el seed de Meta presupuestal')
    const entity=await this.entity();
    if(!entity) throw new BadRequestException('Fallo el seed de Entidad')
    const responsible=await this.responsible();
    if(!responsible) throw new BadRequestException('Fallo el seed de Responsable')
    const auth=await this.auth();
    if(!auth) throw new BadRequestException('Fallo el seed de Autenticacion admin')
    const typeConcept= await this.TypeConcept();
    if(!typeConcept) throw new BadRequestException('Fallo el seed de Tipo de concepto')
    const concept=await this.concept();
    if(!concept) throw new BadRequestException('Fallo el seed de Concepto')
    const correlative=await this.correlative();
    if(!correlative) throw new BadRequestException('Fallo el seed del Correlativo')
    return true;
  }

  //TODO:_UNIDAD ORGANICA 
  private async organicUnit(){   
    await this.organicUnitService.removeAll()
    const object=organicUnitData    
    for (const element of object.data){
      this.organicUnitService.create(element);
    }
    return true;
  }
  //TODO: TIPO DE EMPLEADO
  private async typeEmployee(){
    await this.typeEmployeeService.removeAll()
    const object=typeEmployeeData    
    for (const element of object.data){
      this.typeEmployeeService.create(element);
    }
    return true;
  }
  //TODO: CONDICION
  private async condition(){
    await this.conditionService.removeAll()
    const object=conditionData    
    for (const element of object.data){
      this.conditionService.create(element);
    }
    return true;
  }
  //TODO: REGIMEN LABORAL
  private async laborRegimen(){
    await this.laborRegimeService.removeAll()
    const object=laborRegimeData    
    for (const element of object.data){
      this.laborRegimeService.create(element);
    }
    return true;
  }
  //TODO: GRUPO OCUPACIONAL
  private async occupationalGroup(){
    await this.occupationalGroupService.removeAll()
    const object=occupationalGroupData    
    for (const element of object.data){
      this.occupationalGroupService.create(element);
    }
    return true;
  }
  //TODO: ESTABLECIMIEENTO  
  private async establishment(){
    await this.establishmentService.removeAll()
    const object=establishmentData    
    for (const element of object.data){
      this.establishmentService.create(element);
    }
    return true;
  }
  //TODO: POSICION
  private async position(){
    await this.positionService.removeAll()
    const object=positionData    
    for (const element of object.data){
      this.positionService.create(element);
    }
    return true;
  }   
  //TODO: DIAS DE TRABAJO
  private async workDay(){
    await this.workDayService.removeAll()
    const object=workDayData    
    for (const element of object.data){
      this.workDayService.create(element);
    }
    return true;
  } 
  //TODO: CATEGORIA DE EMPLEADO
  private async employeeCategory(){
    await this.employeCategoryService.removeAll()
    const object=employeeCategoryData 
    for (const element of object.data){
      await this.employeCategoryService.create(element);
    }
    return object.data;
  } 
  //TODO: SALARIO
  private async salary(){
    await this.salaryService.removeAll() 
    const object=salaryData
    var pagination:PaginationDto={
      "page":1,
      "size":100
    }  
    const result= await this.employeCategoryService.findAll(pagination) 
    let salaryDto:CreateSalaryDto
    let count=0
    for(const element of object.data){      
      const employeCategoryId=new EmployeeCategory()
      employeCategoryId.employeeCategoryId=result.data[count].employeeCategoryId
      salaryDto={
        employeeCategory:employeCategoryId,
        salarySalary:element.salarySalary,
        salaryYear:element.salaryYear
      }
      this.salaryService.create(salaryDto);
      count+=1;
    }   
    return true;
  }
  //TODO: SISTEMA DE PENSION
  private async pensionSystem(){
    await this.pensionSystemService.removeAll()
    const object=pensionSystemData 
    for (const element of object.data){
      await this.pensionSystemService.create(element);
    }
    return object.data;
  }
  //TODO: ADMINISTRADOR DEL PENSION
  private async pensionAdministrator(){
    await this.pensionAdministratorService.removeAll()
    const object=pensionAdministratorData
    var pagination:PaginationDto={
      "page":1,
      "size":100
    }  
    const result= await this.pensionSystemService.findAll(pagination)
    let pensionAdministratorDto:CreatePensionAdministratorDto
    let count=0
    for(const element of object.data){      
      const pensionSystemId=new PensionSystem()
      if(element.pensionAdministratorCode==="000001"){
        pensionSystemId.pensionSystemId=result.data[1].pensionSystemId
      }else{
        pensionSystemId.pensionSystemId=result.data[0].pensionSystemId
      }      
      pensionAdministratorDto={
        pensionAdministratorCode:element.pensionAdministratorCode,
        pensionAdministratorDescription:element.pensionAdministratorDescription,
        pensionSystem: pensionSystemId
      }
      this.pensionAdministratorService.create(pensionAdministratorDto);      
    } 
    return true;  
  }
  //TODO: EMPLEADO
  private async employee(){
    await this.employeeService.removeAll();
    const totalEmployee=1000;
    var pagination:PaginationDto={
      "page":1,
      "size":100
    }  
    const arrayTypeEmployee=await this.typeEmployeeService.findAll(pagination);
    const arrayOrganicUnit=await this.organicUnitService.findAll(pagination);
    const arrayCondicion=await this.conditionService.findAll(pagination);
    const arrayLaborRegime=await this.laborRegimeService.findAll(pagination);
    const arrayOccupationalGroup=await this.occupationalGroupService.findAll(pagination);
    const arrayEstablishment=await this.establishmentService.findAll(pagination);
    const arrayPosition=await this.positionService.findAll(pagination);
    const arrayWorkday=await this.workDayService.findAll(pagination);
    const arraySalary=await this.salaryService.findAll(pagination);
    const arrayPensionAdministrator=await this.pensionAdministratorService.findAll(pagination);
    let start: Date
    start = new Date(Date.now());
    for (var i = 1; i < totalEmployee; i++) {
      const createEmployeeDto:CreateEmployeeDto={
        employeeFullname:faker.name.fullName(),
        employeeDni: (i).toString().padStart(8,'0'),
        employeeEntryDate:start,
        employeeCUSPP:(i).toString().padStart(12,'0'),
        employeeAIRHSP:(i).toString().padStart(6,'0'),
        typeEmployee:arrayTypeEmployee.data[Math.floor(Math.random()*arrayTypeEmployee.data.length)],
        organicUnit:arrayOrganicUnit.data[Math.floor(Math.random()*arrayOrganicUnit.data.length)],
        condition:arrayCondicion.data[Math.floor(Math.random()*arrayCondicion.data.length)],
        laborRegime:arrayLaborRegime.data[Math.floor(Math.random()*arrayLaborRegime.data.length)],
        occupationalGroup:arrayOccupationalGroup.data[Math.floor(Math.random()*arrayOccupationalGroup.data.length)],
        establishment:arrayEstablishment.data[Math.floor(Math.random()*arrayEstablishment.data.length)],
        position:arrayPosition.data[Math.floor(Math.random()*arrayPosition.data.length)],
        workday:arrayWorkday.data[Math.floor(Math.random()*arrayWorkday.data.length)],
        salary:arraySalary.data[Math.floor(Math.random()*arrayWorkday.data.length)],
        pensionAdministrator:arrayPensionAdministrator.data[Math.floor(Math.random()*arrayWorkday.data.length)],
      }
      this.employeeService.create(createEmployeeDto);      
    }
    return true 
  }
  //TODO: FINANCIAMIENTO
  private async financing(){
    await this.financingService.removeAll()
    const object=financingData    
    for (const element of object.data){
      this.financingService.create(element);
    }
    return true;    
  }
  //TODO: META PRESUPUESTAL
  private async budgetGoal(){
    await this.budgetGoalService.removeAll()
    const object=budgetGoalData    
    for (const element of object.data){
      this.budgetGoalService.create(element);
    }
    return true;  
  }
  //TODO: ENTIDAD
  private async entity(){
    await this.entityService.removeAll()
    var pagination:PaginationDto={
      "page":1,
      "size":100
    } 
    const arrayFinancing=await this.financingService.findAll(pagination)
    const arrayBudgetGoal=await this.budgetGoalService.findAll(pagination)
    const createEntity:CreateEntityDto={
      entityRuc: '12345678907',
      entityName: 'Universidad',
      entityCode: '000010',
      entityEmployer: 'Universidad Nacional Hermilio Valdizan',
      entityStatus: 1,
      financing: arrayFinancing.data[0],
      budgetGoal: arrayBudgetGoal.data[0],
    }
    const file={
      filename:'logo.jpg'      
    };
    
    this.entityService.create(createEntity,file);
    return true
  }
  //TODO: RESPONSABLE
  private async responsible(){
    await this.responsibleService.removeAll();
    const createResponsible:CreateResponsibleDto={      
      responsibleDni: "46093780",
      responsibleFullname: "Carlos Aguirre Rivera",
      responsibleStatus: 1,
      responsibleSignature: "firma.png"
    }
    const file={
      filename:'firma.png'      
    };
    this.responsibleService.create(createResponsible,file)
    return true
  }
  //TODO: ADMIN USER
  private async auth(){
    await this.authService.removeAll()
    const registerAuthDto:RegisterAuthDto={    
      authFullname:"admin",
      authEmail:"admin@admin.com",
      authPassword:"123456",   
      authRole:["dev","user","admin"]
    }
    this.authService.registerUser(registerAuthDto)
    return true
  }
  //TODO: TIPO DE CONCEPTO
  private async TypeConcept(){
    await this.typeConceptService.removeAll()
    const object=typeConceptData    
    for (const element of object.data){
      this.typeConceptService.create(element);
    }
    return true;   
  }
  //TODO: CONCEPTO
  private async concept(){
    await this.conditionService.removeAll()
    var pagination:PaginationDto={
      "page":1,
      "size":100
    } 
    const arrayPensionAdministrator=await this.typeConceptService.findAll(pagination);
    let conceptRemuneration:CreateConceptDto
    let conceptDelay:CreateConceptDto
    arrayPensionAdministrator.data.forEach((element,index) => {
      if (element.typeConceptDescription==='INGRESOS'){
        conceptRemuneration={
          conceptCodeSiaf: "000002",
          conceptCodePlame: "000002",
          conceptGlosa:"Remuneracion basica",
          conceptDescription: "Remuneracion con descuento de asistencias",
          conceptIsDiscounted:true,
          conceptIsCalculated: true,
          conceptCode: 2,
          typeConcept:arrayPensionAdministrator.data[index]
        }
      }
      if (element.typeConceptDescription==='DESCUENTOS'){
        conceptDelay={
          conceptCodeSiaf: "000001",
          conceptCodePlame: "000001",
          conceptGlosa:"Tardanza",
          conceptDescription: "Tardanza",
          conceptIsDiscounted:false,
          conceptIsCalculated: true,
          conceptCode: 1,
          typeConcept:arrayPensionAdministrator.data[index]
        }
      }
    });    
    await this.conceptService.create(conceptDelay) 
    await this.conceptService.create(conceptRemuneration) 
    return true
  }
  //TODO: CORRELATIVO
  private async correlative(){    
    await this.correlativeService.removeAll()
    const object=correlativeData    
    for (const element of object.data){
      this.correlativeService.create(element);
    }
    return true;  
  }


  //TODO: NUMERO ALEATORIO
  // randomIntFromInterval(min, max) { // min and max included 
  //   return Math.floor(Math.random() * (max - min + 1) + min)
  // }
}
