import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatingController } from './controllers/seating.controller';
import { SeatingService } from './services/seating.service';
import { SeatingArrangement } from './entities/seating-arrangement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatingArrangement])],
  controllers: [SeatingController],
  providers: [SeatingService]
})
export class SeatingModule {}
