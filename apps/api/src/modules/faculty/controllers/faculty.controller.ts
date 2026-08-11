import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FacultyService } from '../services/faculty.service';

@Controller('faculty')
@UseGuards(AuthGuard('jwt'))
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  async getFaculty() {
    return { success: true, data: await this.facultyService.findAll() };
  }

  @Post()
  async createFaculty(@Body() data: any) {
    return { success: true, data: await this.facultyService.create(data) };
  }

  @Patch(':id')
  async updateFaculty(@Param('id') id: string, @Body() data: any) {
    return { success: true, data: await this.facultyService.update(id, data) };
  }

  @Delete(':id')
  async deleteFaculty(@Param('id') id: string) {
    return { success: true, data: await this.facultyService.remove(id) };
  }
}
