import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  private readonly logger=new Logger('AuthService')
  constructor(
      @InjectRepository(Auth)
      private readonly authRepository:Repository<Auth>,
      private jwtAuthService:JwtService
  ){}
 async registerUser(registerAuthDto:RegisterAuthDto){
    try {     
      const {authPassword}=registerAuthDto
      const plainToHash=await bcrypt.hashSync(authPassword,10)
      registerAuthDto={...registerAuthDto,authPassword:plainToHash}
      const auth= this.authRepository.create(registerAuthDto)      
       await this.authRepository.save(auth);
       delete auth.authPassword
       return{...auth,token: this.getJwtToken({authId:auth.authId})}
      // return auth
    } catch (error) {
      this.handleDBExceptions(error);
    }
 }

 async loginUser(loginAuthDto:LoginAuthDto){
  
    const {authEmail,authPassword}=loginAuthDto
    const findUser=await this.authRepository.findOneBy({authEmail});
    if(!findUser) throw new NotFoundException(`User not found`)
    const checkPassword=await bcrypt.compare(authPassword,findUser.authPassword)
    if(!checkPassword) {throw new NotFoundException('password invalid')}
    delete findUser.authPassword
    return{...findUser,token: this.getJwtToken({authId:findUser.authId})}
    // const payload={authId:findUser.authId,auth}
    // const token=await this.jwtAuthService.sign()
 
 }
 private getJwtToken(payload:JwtPayload){
  const token=this.jwtAuthService.sign(payload);
  return token;
 }
  /**TODO: BORRAR TODO */
  async removeAll(){
    try {
      await this.authRepository.createQueryBuilder().delete().execute()        
      return {msg:'Borrar todo'}
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
 private handleDBExceptions(error:any):never{   
  console.log(error) 
  if(error.code==='23505' || error.code==='23503')
    throw new BadRequestException(error.detail);
  this.logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs')
}
}
