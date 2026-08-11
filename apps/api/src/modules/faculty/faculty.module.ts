import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './services/faculty.service';
import { FacultyProfile } from './entities/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyProfile])],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService]
})
export class FacultyModule {}
