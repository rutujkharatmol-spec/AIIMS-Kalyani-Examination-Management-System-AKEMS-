import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
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

  @Post()
  async createStudent(@Body() data: any) {
    return { success: true, data: await this.studentService.create(data) };
  }

  @Patch(':id')
  async updateStudent(@Param('id') id: string, @Body() data: any) {
    return { success: true, data: await this.studentService.update(id, data) };
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return { success: true, data: await this.studentService.remove(id) };
  }
}
