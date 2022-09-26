import { Module } from '@nestjs/common';
import { TicketService } from './services/ticket.service';
import { TicketController } from './controllers/ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketTemp } from './entities/ticketTemp.entity';
import { TypeConcept } from './entities/typeConcept.entity';
import { Concept } from './entities/concept.entity';
import { TypeConceptController } from './controllers/type-concept.controller';
import { ConceptController } from './controllers/concept.controller';
import { TicketTempController } from './controllers/ticket-temp.controller';
import { TicketDetailTempController } from './controllers/ticket-detail-temp.controller';
import { ConceptService } from './services/concept.service';
import { TypeConceptService } from './services/type-concept.service';
import { TicketTempService } from './services/ticket-temp.service';
import { TicketDetailTempService } from './services/ticket-detail-temp.service';
import { TicketDetailTemp } from './entities/ticketDetailTemp.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Correlative } from './entities/correlative.entity';
import { CorrelativeService } from './services/correlative.service';
import { CorrelativeController } from './controllers/correlative.controller';


@Module({
  controllers: [TicketController, TypeConceptController, ConceptController, TicketTempController, TicketDetailTempController, CorrelativeController],
  providers: [TicketService, ConceptService, TypeConceptService, TicketTempService, TicketDetailTempService, CorrelativeService],
  imports:[
    AuthModule,    
    TypeOrmModule.forFeature([Ticket,TicketTemp,TicketDetailTemp,TypeConcept,Concept,Correlative])
  ]
})
export class TicketModule {}
