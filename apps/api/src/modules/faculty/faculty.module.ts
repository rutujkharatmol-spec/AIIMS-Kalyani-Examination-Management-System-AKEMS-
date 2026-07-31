import { Module } from '@nestjs/common';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './services/faculty.service';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService]
})
export class FacultyModule {}
