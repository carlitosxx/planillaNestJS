import { createParamDecorator,ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser=createParamDecorator(
    (data,ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest();
        const auth= req.user;        
        if(!auth) throw new InternalServerErrorException('User not found (request)');
        return auth;
    }
);