import { Controller, Post, Param } from '@nestjs/common';
import { HallTicketService } from '../services/hall-ticket.service';

@Controller('hall-tickets')
export class HallTicketController {
  constructor(private readonly hallTicketService: HallTicketService) {}

  @Post('generate-cycle/:id')
  async generate(@Param('id') id: string) {
    return this.hallTicketService.generateForCycle(id);
  }
}
