// Scaffolded - Authentication service with JWT
// Design choice: Secure authentication with refresh tokens

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Save session
    await this.saveSession(user.id, tokens);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Save session
    await this.saveSession(user.id, tokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      // Check session
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.userId !== payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(payload.sub);

      // Update session
      await this.updateSession(session.id, tokens);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveSession(userId: string, tokens: any) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.session.create({
      data: {
        userId,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
      },
    });
  }

  private async updateSession(sessionId: string, tokens: any) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  }
}
