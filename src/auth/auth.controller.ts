import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {AuthGuard}from '@nestjs/passport'
import { GetUser } from './decorators/get-user.decorator';
import { Authorization } from './decorators';
import { Auth } from './entities/auth.entity';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  registerUser(@Body() registerAuthDto: RegisterAuthDto) {
    
    return this.authService.registerUser(registerAuthDto);
  }
  @Post('login')
  loginUser(@Body() loginAuthDto:LoginAuthDto){
    return this.authService.loginUser(loginAuthDto)
  }

  @Get('private')
  @Authorization(ValidRoles.user)

  testingPrivateRoute(
    @GetUser() auth:Auth
  ){
    return {
      ok:true,
      message:auth
    }
  }

}
