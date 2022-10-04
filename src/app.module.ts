import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { EntityModule } from './entity/entity.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { SeedModule } from './seed/seed.module';
import {ServeStaticModule}from '@nestjs/serve-static' 


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
     type:'postgres',
     host:  process.env.DB_HOST,
     port: +process.env.DB_PORT,
     database: process.env.DB_NAME,
     username: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
     autoLoadEntities:true,
     synchronize:true 
    }),
    // ServeStaticModule.forRoot({
    //   rootPath:join(__dirname,'..','public')
    // }),
    EmployeesModule,
    CommonModule,
    FilesModule,
    EntityModule,
    AuthModule,
    TicketModule,
    SeedModule
  ],

})
export class AppModule {}
