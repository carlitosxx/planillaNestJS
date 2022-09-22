import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector:Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[]=this.reflector.get(META_ROLES,context.getHandler())
    if(!validRoles) return true;
    if(validRoles.length===0) return true;
    const req=context.switchToHttp().getRequest()
    const user=req.user as Auth;
    if(!user) throw new BadRequestException('user not found');
    // console.log({userRoles:user.authRole})
    for(const role of user.authRole){
      if ( validRoles.includes(role)){
        return true
      }
    }

    throw new ForbiddenException(`User ${user.authFullname} need a valid role: [${validRoles}]`)
  }
}
