import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { StudentProfile } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile])],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
