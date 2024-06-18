import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserService } from './user.service';
// import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/onlyauth')
  async hiddenInformation() {
    return 'hidden information';
  }

  @UseGuards(AuthGuard)
  @Get('/user-details')
  async getUserDetails(@Query('phone') phone: string, @Req() request, @Res() response): Promise<any> {
    try {
      const user = await this.userService.findUserByPhone(phone);
      return response.status(HttpStatus.OK).json({
        // phone: user.phone,
        // name: user.name,
        // email: user.email,
        // Add other user details you want to return
        user,
        message:'success'
      });
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: error.message,
        error: 'Not Found',
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(AuthGuard)
  @Post('updateByPhone')
  async updateByPhone(@Res() response, @Body() updateUserDto: UpdateUserDto) {
    const { phone } = updateUserDto;
    const user = await this.userService.updateByPhone(phone, updateUserDto);
    return response.status(HttpStatus.ACCEPTED).json({
      message: 'User Register Successfully',
      user,
    });
  }
}
