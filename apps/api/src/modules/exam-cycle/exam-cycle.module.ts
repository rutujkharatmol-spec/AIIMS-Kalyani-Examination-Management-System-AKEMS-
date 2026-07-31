import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamCycleController } from './controllers/exam-cycle.controller';
import { ExamCycleService } from './services/exam-cycle.service';
import { ExamCycle } from './entities/exam-cycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamCycle])],
  controllers: [ExamCycleController],
  providers: [ExamCycleService]
})
export class ExamCycleModule {}
