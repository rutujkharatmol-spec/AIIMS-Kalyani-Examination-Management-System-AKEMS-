import { Controller, Get } from '@nestjs/common';
import { FacultyService } from '../services/faculty.service';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  async getFaculty() {
    return { success: true, data: await this.facultyService.findAll() };
  }
}
