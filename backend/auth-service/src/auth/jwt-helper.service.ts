import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtHelperService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  decodeToken(token: string): JwtPayload | null {
    const decoded = this.jwtService.decode(token);
    if (!decoded || typeof decoded !== 'object' || !('sub' in decoded)) {
      return null;
    }
    return decoded as JwtPayload;
  }
}
