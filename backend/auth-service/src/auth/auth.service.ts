import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { JwtHelperService } from './jwt-helper.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtHelper: JwtHelperService,
  ) {}

  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create(email, password);
    const token = this.jwtHelper.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.validateUserCredentials(email, password);
    const token = this.jwtHelper.generateToken(user);
    return { user, token };
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const payload = this.jwtHelper.verifyToken(token);
      const user = await this.usersRepository.findById(payload.sub);
      return user ? { valid: true, user } : { valid: false };
    } catch {
      return { valid: false };
    }
  }

  async refreshToken(token: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    try {
      const payload = this.jwtHelper.decodeToken(token);
      if (!payload) return this.buildFailure('Invalid token format');

      const user = await this.usersRepository.findById(payload.sub);
      if (!user) return this.buildFailure('User not found');

      try {
        this.jwtHelper.verifyToken(token);
        return { success: true, token, user };
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          const newToken = this.jwtHelper.generateToken(user);
          return { success: true, token: newToken, user };
        }
        return this.buildFailure('Invalid token');
      }
    } catch {
      return this.buildFailure('Failed to refresh token');
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || !(await this.usersRepository.validatePassword(user, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private buildFailure(message: string): { success: false; message: string } {
    return { success: false, message };
  }
}
