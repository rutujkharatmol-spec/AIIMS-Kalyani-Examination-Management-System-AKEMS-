import { Module } from '@nestjs/common';
import { HallTicketController } from './controllers/hall-ticket.controller';
import { HallTicketService } from './services/hall-ticket.service';

@Module({
  controllers: [HallTicketController],
  providers: [HallTicketService]
})
export class HallTicketModule {}
