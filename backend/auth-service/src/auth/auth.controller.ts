import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {AuthService} from './auth.service';
import {User} from '../entities/user.entity';
import * as console from "node:console";

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
  user?: User | null;
}

interface ValidateTokenRequest {
  token: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  message: string;
  user?: User | null;
}

interface RefreshTokenRequest {
  token: string;
}

interface RefreshTokenResponse {
  success: boolean;
  token: string;
  message: string;
  user?: User | null;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @GrpcMethod('AuthService', 'Register')
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const {user, token} = await this.authService.register(request.email, request.password);
      return {
        success: true,
        token,
        message: 'Registration successful',
        user,
      };
    } catch (error) {
      return {
        success: false,
        token: '',
        message: error.message || 'Registration failed',
        user: null,
      };
    }
  }

  @GrpcMethod('AuthService', 'Login')
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const {user, token} = await this.authService.login(request.email, request.password);
      return {
        success: true,
        token,
        message: 'Login successful',
        user,
      };
    } catch (error) {
      return {
        success: false,
        token: '',
        message: error.message || 'Login failed',
        user: null,
      };
    }
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    const {valid, user} = await this.authService.validateToken(request.token);
    return {
      valid,
      message: valid ? 'Token is valid' : 'Token is invalid or expired',
      user: user || null,
    };
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const result = await this.authService.refreshToken(request.token);
      
      if (!result.success) {
        return {
          success: false,
          token: '',
          message: result.message || 'Failed to refresh token',
          user: null,
        };
      }
      
      return {
        success: true,
        token: result.token,
        message: 'Token refreshed successfully',
        user: result.user,
      };
    } catch (error) {
      return {
        success: false,
        token: '',
        message: error.message || 'Failed to refresh token',
        user: null,
      };
    }
  }
}
