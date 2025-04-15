import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  AuthServiceClient,
  RegisterRequest,
  LoginRequest,
  ValidateTokenRequest,
  AuthResponse,
  ValidateTokenResponse,
} from '../generated/auth.pb';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject('AUTH_PACKAGE') private client: ClientGrpc,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async register(email: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.authService.register({ email, password }),
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.authService.login({ email, password }),
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async validateToken(payload: any) {
    try {
      // Get the token from the request
      const token = payload.token || payload;
      
      // Validate the token with the Auth service
      const response = await firstValueFrom(
        this.authService.validateToken({ token }),
      );
      
      return {
        valid: response.valid,
        user: response.user,
      };
    } catch (error) {
      return { valid: false, user: null };
    }
  }

  async validateTokenString(token: string) {
    try {
      console.log('Validating token string:', token);
      
      const response = await firstValueFrom(
        this.authService.validateToken({ token }),
      );
      
      console.log('Token validation response:', response);
      
      return {
        valid: response.valid,
        user: response.user,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, user: null };
    }
  }

  async refreshToken(token: string) {
    try {
      console.log('Refreshing token:', token);
      
      const response = await firstValueFrom(
        this.authService.refreshToken({ token }),
      );
      
      console.log('Token refresh response:', response);
      
      return {
        success: response.success,
        token: response.token,
        message: response.message,
        user: response.user,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { 
        success: false, 
        token: '', 
        message: error.message || 'Failed to refresh token',
        user: null 
      };
    }
  }
}
