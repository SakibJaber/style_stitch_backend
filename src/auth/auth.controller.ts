import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import express, {Request, Response} from 'express';
import { AuthGuard } from './auth.guard';
import { Payload } from 'src/types/payload';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // @Post('register')
  // async register(@Body() registerDTO: CreateUserDto) {
  //   const user = await this.userService.create(registerDTO);
  //   const payload = {
  //     phone: user.phone,
  //   };

  //   const token = await this.authService.signPayload(payload);
  //   return { user, token };
  // }

  @Post('login')
  async login(@Body() loginDTO: CreateUserDto) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      phone: user.phone,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  

@Post('loginOrRegister')
async loginOrRegister(
  @Req() request,
  @Res() response: Response,
  @Body() createUserDto: CreateUserDto,
) {
  let user;
  try {
    // Check if the user exists by phone number
    user = await this.userService.findByLogin(createUserDto);

    // If user exists, proceed to login
    const payload = { phone: user.phone };
    const token = await this.authService.signPayload(payload);

    return response.status(HttpStatus.ACCEPTED).json({
      message: 'User Logged in Successfully',
      user,
      token,
    });
  } catch (error) {
    if (error instanceof HttpException && error.getStatus() === HttpStatus.BAD_REQUEST) {
      // If user does not exist, create a new user
      user = await this.userService.create(createUserDto);
      const payload = { phone: user.phone };
      const token = await this.authService.signPayload(payload);

      return response.status(HttpStatus.CREATED).json({
        message: 'User Registered Successfully',
        user,
        token,
      });
    } else {
      // Other errors
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }
}



}
