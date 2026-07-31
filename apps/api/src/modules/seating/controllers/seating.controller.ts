import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeatingService } from '../services/seating.service';

@Controller('seating')
@UseGuards(AuthGuard('jwt'))
export class SeatingController {
  constructor(private readonly seatingService: SeatingService) {}

  @Post('auto-allocate/:examCycleId')
  async autoAllocate(@Param('examCycleId') examCycleId: string) {
    return this.seatingService.autoAllocate(examCycleId);
  }

  @Get(':examCycleId')
  async getArrangements(@Param('examCycleId') examCycleId: string) {
    return { success: true, data: await this.seatingService.getArrangements(examCycleId) };
  }
}
