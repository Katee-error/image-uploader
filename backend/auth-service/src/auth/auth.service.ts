import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create(email, password);

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersRepository.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        return { valid: false };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false };
    }
  }

  async refreshToken(token: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    try {
      const decoded = this.jwtService.decode(token);
      
      if (!decoded || !decoded.sub) {
        return { 
          success: false, 
          message: 'Invalid token format' 
        };
      }
      
      const user = await this.usersRepository.findById(decoded.sub);
      if (!user) {
        return { 
          success: false, 
          message: 'User not found' 
        };
      }
      
      try {
        this.jwtService.verify(token);
        return { 
          success: true, 
          token, 
          user 
        };
      } catch (verifyError) {
        if (verifyError.name === 'TokenExpiredError') {
          const newToken = this.generateToken(user);
          return { 
            success: true, 
            token: newToken, 
            user 
          };
        }

        return { 
          success: false, 
          message: 'Invalid token' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to refresh token' 
      };
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
