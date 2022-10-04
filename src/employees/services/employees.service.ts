import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import {validate as isUUID}  from 'uuid'
@Injectable()
export class EmployeesService {
  private readonly logger=new Logger('EmployeesService')
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository:Repository<Employee> 
  ){}
  /**TODO: CREAR */
  async create(createEmployeeDto: CreateEmployeeDto) {
    try { 
      createEmployeeDto.employeeFullname=createEmployeeDto.employeeFullname.toLowerCase();
      const employee=this.employeeRepository.create(createEmployeeDto)
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  /**TODO: PAGINACION */
  async findAll(paginationDto:PaginationDto) {
    const {page=1,size=100}=paginationDto
    const {employeeDni,employeeFullname,withStatus}=paginationDto    
    if(employeeDni){
      const query=await this.employeeRepository.createQueryBuilder('employees')
      .where(`"employeeDni" LIKE :q`,{q: `%${employeeDni}%`}).getMany()      
      return query
    }
    if(employeeFullname){
      const query=await this.employeeRepository.createQueryBuilder('employees')
      .where(`"employeeFullname" LIKE :q`,{q: `%${employeeFullname.toLowerCase()}%`}).getMany()      
      return query
    }
    if(withStatus){
      const query= await this.employeeRepository.findAndCount({      
        select:{
          employeeId:true,
          employeeFullname:true,
          employeeDni:true,
          typeEmployee:{typeEmployeeDescription:true}
  
        },
        order:{
          employeeDni:1
        },
        relations:['typeEmployee'],
        where:{employeeStatus:withStatus}
      })  
      return {
        total:query[1],
        data:query[0]
      }
    }
    const calcSkip=(page-1)*size
    const query= await this.employeeRepository.findAndCount({
      take:size,
      skip:calcSkip,
      order:{
        employeeDni:1
      },
      relations:['typeEmployee','organicUnit','condition','laborRegime',
      'occupationalGroup','establishment','position','workday','salary',
      'salary.employeeCategory','pensionAdministrator','pensionAdministrator.pensionSystem']
    })    
    return {
      total:query[1],
      data:query[0]
    }
  }
  
  /**TODO: BUSCAR POR: */
  async findOne(term: string) {
    let employee:Employee
    if(isUUID(term)){
      employee=await this.employeeRepository.findOne({
        where:{employeeId:term},
        relations:['typeEmployee','organicUnit','condition','laborRegime','occupationalGroup','establishment','position','workday','salary','salary.employeeCategory','pensionAdministrator','pensionAdministrator.pensionSystem']})
    }else{      
      const queryBuilder= this.employeeRepository.createQueryBuilder('employee');
      employee=await queryBuilder
        .leftJoinAndSelect('employee.condition','employeCondition')
        .leftJoinAndSelect('employee.typeEmployee','employeTypeEmployee')
        .leftJoinAndSelect('employee.organicUnit','employeeOrganicUnit')
        .leftJoinAndSelect('employee.salary','salary')
        .leftJoinAndSelect('salary.employeeCategory','employeeCategory')
        .leftJoinAndSelect('employee.pensionAdministrator','pensionAdministrator')
        .leftJoinAndSelect('pensionAdministrator.pensionSystem','pensionSystem')
        .leftJoinAndSelect('employee.laborRegime','laborRegime')
        .leftJoinAndSelect('employee.occupationalGroup','occupationalGroup')
        .leftJoinAndSelect('employee.establishment','establishment')
        .leftJoinAndSelect('employee.position','position')
        .leftJoinAndSelect('employee.workday','workday')
        .where('"employeeFullname"=:employeeFullname or "employeeDni"=:employeeDni',
          {employeeFullname:term,employeeDni:term}).getOne();
    } 
    if(!employee)  throw new NotFoundException(`employee with ${term} not found`)
    return employee
  }
  /**TODO: ACTUALIZAR */
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {      
      var employee=await this.employeeRepository.preload({
        employeeId:id,
        ...updateEmployeeDto
      });
      if(!employee) throw new NotFoundException(`Employee with id: ${id} not found`)
    try {  
        await this.employeeRepository.save(employee)        
        return employee       
    } catch (error) {      
      this.handleDBExceptions(error)
    }
  }
  /**TODO: BORRAR */
  async remove(id: string) {
    const employee=await this.findOne(id);
    await this.employeeRepository.remove(employee)
    return {msg:'deleted employee'}
  }
   /**TODO: BORRAR TODO */
   async removeAll(){
    try {
      await this.employeeRepository.createQueryBuilder().delete().execute()        
      return {msg:'Borrar todo'}
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  /**TODO: ATRAPAR EXCEPCION DE BASE DE DATOS */
  private handleDBExceptions(error:any){    
    if(error.code==='23505')
      throw new BadRequestException(error.detail);
    if(error.code==='23503')
      throw new BadRequestException(error.detail);
    if(error.code==='22P02')
      throw new BadRequestException('The uuid is invalid')  
    this.logger.error(error);
    console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
