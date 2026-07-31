import { Injectable } from '@nestjs/common';

@Injectable()
export class FacultyService {
  async findAll() {
    return [{ id: 'fac-1', employee_id: 'EMP001', designation: 'Professor' }];
  }
}
