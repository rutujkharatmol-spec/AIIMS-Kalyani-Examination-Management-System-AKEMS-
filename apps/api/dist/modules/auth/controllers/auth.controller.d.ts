import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(signInDto: any): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            user: {
                id: string;
                email: string;
                name: string;
                role: string;
            };
        };
        timestamp: string;
    }>;
    logout(body: any): Promise<{
        success: boolean;
        timestamp: string;
    }>;
}
