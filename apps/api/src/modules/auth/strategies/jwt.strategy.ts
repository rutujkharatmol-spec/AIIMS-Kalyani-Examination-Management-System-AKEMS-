import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    let user = null;
    try {
      user = await this.userRepository.findOne({ where: { id: payload.sub } });
    } catch (e) {
      // Ignore invalid UUID syntax errors if it's the mock user
      console.warn('DB lookup failed in JwtStrategy, possibly mock user.');
    }
    
    // Fallback for mock Dean user
    if (!user && payload.username === 'dean@aiimskalyani.edu.in') {
      return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }
    return { userId: payload.sub, username: payload.username, roles: payload.roles };
  }
}
