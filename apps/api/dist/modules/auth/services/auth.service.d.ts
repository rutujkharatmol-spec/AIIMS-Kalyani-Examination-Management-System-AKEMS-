import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private jwtService;
    private userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    login(email: string, pass: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
}
