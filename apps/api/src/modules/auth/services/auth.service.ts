import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(email: string, pass: string) {
    // Check if user exists in database
    let user = await this.userRepository.findOne({ where: { email } });
    
    // For scaffolding/demo purposes, we allow a hardcoded fallback 
    let role = 'STUDENT';
    if (!user && email === 'dean@aiimskalyani.edu.in' && pass === 'password') {
       role = 'DEAN';
       user = {
         id: '00000000-0000-0000-0000-000000000001',
         email: 'dean@aiimskalyani.edu.in',
         password_hash: '', // Handled by mock
         first_name: 'Dean',
         last_name: 'Examination',
         created_at: new Date(),
         updated_at: new Date(),
         is_active: true,
         is_locked: false,
         failed_login_attempts: 0,
         last_login_at: new Date()
       } as User;
    } else if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } else {
      // Validate real password hash
      const isMatch = await bcrypt.compare(pass, user.password_hash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Note: In a real app, you would fetch the user's role from a relation
      role = 'USER'; 
    }

    const payload = { username: user.email, sub: user.id, roles: [role] };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: role
      }
    };
  }

  async logout(userId: string) {
    return { success: true };
  }
}
