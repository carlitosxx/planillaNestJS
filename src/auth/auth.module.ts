import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import {JwtModule} from '@nestjs/jwt';
import { jwtConstant } from './auth.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {PassportModule} from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[],
      inject:[],
      useFactory:(configService:ConfigService)=>{
        return{
          secret:process.env.JWT_SECRET,
          signOptions:{
            expiresIn:'30d'
          }
        }
      }
    })  
  ],
  exports:[PassportModule,TypeOrmModule,JwtStrategy,JwtModule]
})
export class AuthModule {}
