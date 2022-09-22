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
  // @SetMetadata('roles',['admin','super-user'])
  @Get('private')
  @Authorization(ValidRoles.user)
  // @RoleProtected(ValidRoles.superUser)
  // @UseGuards(AuthGuard(),UserRoleGuard)
  testingPrivateRoute(
    @GetUser() auth:Auth
  ){
    return {
      ok:true,
      message:auth
    }
  }
  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
