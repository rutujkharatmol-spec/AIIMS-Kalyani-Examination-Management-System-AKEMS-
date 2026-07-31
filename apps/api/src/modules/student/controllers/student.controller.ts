import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudentService } from '../services/student.service';

@Controller('students')
@UseGuards(AuthGuard('jwt')) // Protect all student routes
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getStudents() {
    return { success: true, data: await this.studentService.findAll() };
  }
}
