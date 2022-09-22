import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';
import {Strategy,ExtractJwt} from 'passport-jwt'
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Auth)
        private readonly authRepository:Repository<Auth>,
        configService:ConfigService
    ){
        super({
        secretOrKey:configService.get('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload:JwtPayload):Promise<Auth>{
        const {authId}=payload;
        const auth=await this.authRepository.findOneBy({authId});
        if(!auth) throw new UnauthorizedException('Token not valid')
        if(!auth.authStatus) throw new UnauthorizedException('User is Inactive, talk with an administrator')
        return auth ;
    }
}