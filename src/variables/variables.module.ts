import { Module } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variable } from './entities/variable.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [VariablesController],
  providers: [VariablesService],
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Variable])
  ]
})
export class VariablesModule {}
