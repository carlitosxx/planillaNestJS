import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { EntityModule } from 'src/entity/entity.module';
import { AuthModule } from 'src/auth/auth.module';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    EmployeesModule,
    EntityModule,
    AuthModule,
    TicketModule
  ]
})
export class SeedModule {}
