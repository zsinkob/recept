import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (ok) {
      // omit password
      const { password, ...rest } = user as any;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('User exists');
    const user = await this.usersService.createUser(email, password, name);
    return { id: user.id, email: user.email, name: user.name };
  }
}
