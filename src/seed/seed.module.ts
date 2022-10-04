import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { EntityModule } from 'src/entity/entity.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    EmployeesModule,
    EntityModule
  ]
})
export class SeedModule {}
