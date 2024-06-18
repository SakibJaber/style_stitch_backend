import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/dto/create-user.dto';
import { Payload } from 'src/types/payload';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly jwtServ: JwtService,
  ) {}

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtServ.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      return decoded; // Return decoded payload
    } catch (error) {
      throw new Error('Invalid token!!!'); // Handle invalid token
    }
  }

  validateToken(token: string) {
    return this.jwtServ.verify(token, {
      secret: process.env.SECRET_KEY,
    });
  }

  async signPayload(payload: Payload): Promise<string> {
    return this.jwtServ.sign(payload, {
      expiresIn: '7d',
      secret: process.env.SECRET_KEY,
    });
    // return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }
  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  //////////////////////////////////////////

  async loginOrRegister(createUserDto: CreateUserDto) {
    let user;
    try {
      user = await this.userService.findByLogin(createUserDto);
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.BAD_REQUEST
      ) {
        user = await this.userService.create(createUserDto);
      } else {
        throw error;
      }
    }

    const payload = { phone: user.phone };
    const token = await this.signPayload(payload);
    return { user, token };
  }
}
