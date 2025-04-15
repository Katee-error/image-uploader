import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { RegisterRequest, LoginRequest, User } from '../generated/auth.pb';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto implements RegisterRequest {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class LoginDto implements LoginRequest {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(
        registerDto.email,
        registerDto.password,
      );

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: 'User registered successfully',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
      }

      return {
        success: true,
        message: 'Login successful',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req) {
    return {
      success: true,
      user: req.user,
    };
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async refreshToken(@Body('token') token: string) {
    try {
      if (!token) {
        throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.authService.refreshToken(token);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
      }

      return {
        success: true,
        message: 'Token refreshed successfully',
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to refresh token',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
