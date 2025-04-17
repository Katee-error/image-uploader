import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { AuthResponse, LoginRequest, RefreshTokenRequest, RefreshTokenResponse, RegisterRequest, ValidateTokenRequest, ValidateTokenResponse } from './auth-interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private async handleAuthAction<T>(
    action: () => Promise<{ user: User; token: string }>,
    successMessage: string,
    failureMessage: string,
  ): Promise<T & Partial<AuthResponse>> {
    try {
      const { user, token } = await action();
      return {
        success: true,
        token,
        message: successMessage,
        user,
      } as T;
    } catch (error) {
      return {
        success: false,
        token: '',
        message: error.message || failureMessage,
        user: null,
      } as T;
    }
  }

  @GrpcMethod('AuthService', 'Register')
  register(request: RegisterRequest): Promise<AuthResponse> {
    return this.handleAuthAction<AuthResponse>(
      () => this.authService.register(request.email, request.password),
      'Registration successful',
      'Registration failed',
    );
  }

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<AuthResponse> {
    return this.handleAuthAction<AuthResponse>(
      () => this.authService.login(request.email, request.password),
      'Login successful',
      'Login failed',
    );
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    const { valid, user } = await this.authService.validateToken(request.token);
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

      return {
        success: result.success,
        token: result.token || '',
        message: result.message || (result.success ? 'Token refreshed successfully' : 'Failed to refresh token'),
        user: result.user || null,
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
