import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  
  @Get()
  async findAll() {
    return {
      success: true,
      data: [
        { id: '1', name: 'Dr. Sharma', role: 'HOD', status: 'Active' },
        { id: '2', name: 'Rahul K.', role: 'STUDENT', status: 'Active' },
      ],
      timestamp: new Date().toISOString()
    };
  }
}
